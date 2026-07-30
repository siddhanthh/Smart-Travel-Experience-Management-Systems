const pool = require('../config/db.mysql');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notificationService');

// TRICKY SCENARIO #3: Transaction rollback on split failure
exports.addExpense = async ({ trip_id, title, amount, split_among }, paidBy) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch trip members
    const [members] = await connection.query(
      'SELECT user_id FROM trip_members WHERE trip_id = ?',
      [trip_id]
    );

    if (members.length === 0) {
      throw new AppError('Trip has no members to split expenses with.', 400);
    }

    // Determine target member IDs for split
    let targetUserIds = members.map((m) => m.user_id);
    if (Array.isArray(split_among) && split_among.length > 0) {
      const validUserIds = split_among.map(Number).filter((id) => targetUserIds.includes(id));
      if (validUserIds.length > 0) {
        targetUserIds = validUserIds;
      }
    }

    // 2. Insert main expense record
    const [expenseResult] = await connection.query(
      'INSERT INTO expenses (trip_id, paid_by, title, amount) VALUES (?, ?, ?, ?)',
      [trip_id, paidBy, title, amount]
    );
    const expenseId = expenseResult.insertId;

    // 3. Calculate split amount
    const splitAmount = (amount / targetUserIds.length).toFixed(2);

    // 4. Insert splits for target members
    for (const userId of targetUserIds) {
      await connection.query(
        'INSERT INTO expense_splits (expense_id, user_id, amount) VALUES (?, ?, ?)',
        [expenseId, userId, splitAmount]
      );
    }

    await connection.commit();

    // Send notifications to members (Best Effort)
    for (const userId of targetUserIds) {
      if (userId !== paidBy) {
        notificationService.createNotification({
          userId,
          type: 'expense_added',
          title: 'New Expense Added',
          message: `An expense of ₹${amount} for "${title}" was added.`,
          referenceId: expenseId,
          referenceType: 'expense'
        }).catch(() => {});
      }
    }

    return { id: expenseId, trip_id, paid_by: paidBy, title, amount, splitAmount };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.getTripExpenses = async (tripId) => {
  const [expenses] = await pool.query(
    `SELECT e.*, u.name as paid_by_name 
     FROM expenses e
     JOIN users u ON e.paid_by = u.id
     WHERE e.trip_id = ?
     ORDER BY e.created_at DESC`,
    [tripId]
  );
  return expenses;
};

exports.getTripBalances = async (tripId) => {
  // 1. Fetch gross splits where user_id != paid_by
  const [splitRows] = await pool.query(
    `SELECT 
       es.user_id AS from_id,
       u_from.name AS from_name,
       e.paid_by AS to_id,
       u_to.name AS to_name,
       SUM(es.amount) AS total_amount
     FROM expense_splits es
     JOIN expenses e ON es.expense_id = e.id
     JOIN users u_from ON es.user_id = u_from.id
     JOIN users u_to ON e.paid_by = u_to.id
     WHERE e.trip_id = ? AND es.user_id != e.paid_by
     GROUP BY es.user_id, e.paid_by`,
    [tripId]
  );

  // 2. Fetch completed settlements for this trip
  const [settlementRows] = await pool.query(
    `SELECT 
       payer_id AS from_id,
       payee_id AS to_id,
       SUM(amount) AS total_amount
     FROM settlements
     WHERE trip_id = ? AND status = 'completed'
     GROUP BY payer_id, payee_id`,
    [tripId]
  );

  // 3. Build pairwise ledger: key = `${min(a,b)}_${max(a,b)}`
  const userNames = {};
  const pairwiseNet = {};

  function getKey(u1, u2) {
    return u1 < u2 ? `${u1}_${u2}` : `${u2}_${u1}`;
  }

  splitRows.forEach((row) => {
    userNames[row.from_id] = row.from_name;
    userNames[row.to_id] = row.to_name;

    const u1 = Number(row.from_id);
    const u2 = Number(row.to_id);
    const key = getKey(u1, u2);
    if (!pairwiseNet[key]) pairwiseNet[key] = 0;

    if (u1 < u2) {
      pairwiseNet[key] += Number(row.total_amount);
    } else {
      pairwiseNet[key] -= Number(row.total_amount);
    }
  });

  settlementRows.forEach((row) => {
    const u1 = Number(row.from_id);
    const u2 = Number(row.to_id);
    const key = getKey(u1, u2);
    if (!pairwiseNet[key]) pairwiseNet[key] = 0;

    if (u1 < u2) {
      pairwiseNet[key] -= Number(row.total_amount);
    } else {
      pairwiseNet[key] += Number(row.total_amount);
    }
  });

  // 4. Convert to list of { from, fromName, to, toName, amount }
  const result = [];
  Object.entries(pairwiseNet).forEach(([key, net]) => {
    const [idA, idB] = key.split('_').map(Number);
    const roundedNet = Number(net.toFixed(2));

    if (roundedNet > 0) {
      result.push({
        from: idA,
        fromName: userNames[idA] || `User #${idA}`,
        to: idB,
        toName: userNames[idB] || `User #${idB}`,
        amount: roundedNet
      });
    } else if (roundedNet < 0) {
      result.push({
        from: idB,
        fromName: userNames[idB] || `User #${idB}`,
        to: idA,
        toName: userNames[idA] || `User #${idA}`,
        amount: Math.abs(roundedNet)
      });
    }
  });

  return result;
};

exports.settlePayment = async ({ trip_id, payee_id, amount }, payerId) => {
  // 1. Calculate gross amount payer owes payee from expense splits
  const [owedRows] = await pool.query(
    `SELECT COALESCE(SUM(es.amount), 0) as total_owed
     FROM expense_splits es
     JOIN expenses e ON es.expense_id = e.id
     WHERE e.trip_id = ? AND es.user_id = ? AND e.paid_by = ?`,
    [trip_id, payerId, payee_id]
  );

  // 2. Subtract gross amount payee owes payer from expense splits (counter debt)
  const [counterRows] = await pool.query(
    `SELECT COALESCE(SUM(es.amount), 0) as total_counter
     FROM expense_splits es
     JOIN expenses e ON es.expense_id = e.id
     WHERE e.trip_id = ? AND es.user_id = ? AND e.paid_by = ?`,
    [trip_id, payee_id, payerId]
  );

  // 3. Subtract settlements from payer to payee
  const [settledRows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as total_settled
     FROM settlements
     WHERE trip_id = ? AND payer_id = ? AND payee_id = ? AND status = 'completed'`,
    [trip_id, payerId, payee_id]
  );

  // 4. Add settlements from payee to payer
  const [counterSettledRows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as total_counter_settled
     FROM settlements
     WHERE trip_id = ? AND payer_id = ? AND payee_id = ? AND status = 'completed'`,
    [trip_id, payee_id, payerId]
  );

  const netOwed = (Number(owedRows[0].total_owed) - Number(counterRows[0].total_counter)) - (Number(settledRows[0].total_settled) - Number(counterSettledRows[0].total_counter_settled));
  const outstanding = Math.max(0, netOwed);

  if (amount > outstanding + 0.01) {
    throw new AppError(
      `Invalid settlement. Your outstanding debt to this user is ₹${outstanding.toFixed(2)}, cannot settle ₹${amount}.`,
      400
    );
  }

  // Record settlement
  const [result] = await pool.query(
    `INSERT INTO settlements (trip_id, payer_id, payee_id, amount, status)
     VALUES (?, ?, ?, ?, 'completed')`,
    [trip_id, payerId, payee_id, amount]
  );

  return { id: result.insertId, trip_id, payer_id: payerId, payee_id, amount, status: 'completed' };
};