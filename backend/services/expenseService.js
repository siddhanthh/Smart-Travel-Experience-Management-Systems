const pool = require('../config/db.mysql');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notificationService');

// TRICKY SCENARIO #3: Transaction rollback on split failure
exports.addExpense = async ({ trip_id, title, amount }, paidBy) => {
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

    // 2. Insert main expense record
    const [expenseResult] = await connection.query(
      'INSERT INTO expenses (trip_id, paid_by, title, amount) VALUES (?, ?, ?, ?)',
      [trip_id, paidBy, title, amount]
    );
    const expenseId = expenseResult.insertId;

    // 3. Calculate equal split amount
    const splitAmount = (amount / members.length).toFixed(2);

    // 4. Insert splits for all members
    for (const member of members) {
      await connection.query(
        'INSERT INTO expense_splits (expense_id, user_id, amount) VALUES (?, ?, ?)',
        [expenseId, member.user_id, splitAmount]
      );
    }

    await connection.commit();

    // Send notifications to members (Best Effort)
    for (const member of members) {
      if (member.user_id !== paidBy) {
        notificationService.createNotification({
          userId: member.user_id,
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
  // Calculates net balance per user in the trip
  const [members] = await pool.query(
    `SELECT tm.user_id, u.name 
     FROM trip_members tm
     JOIN users u ON tm.user_id = u.id
     WHERE tm.trip_id = ?`,
    [tripId]
  );

  const balances = {};
  members.forEach((m) => {
    balances[m.user_id] = { userId: m.user_id, name: m.name, paidTotal: 0, owedTotal: 0, netBalance: 0 };
  });

  // Calculate total paid per user
  const [paidRows] = await pool.query(
    'SELECT paid_by, SUM(amount) as total FROM expenses WHERE trip_id = ? GROUP BY paid_by',
    [tripId]
  );
  paidRows.forEach((p) => {
    if (balances[p.paid_by]) balances[p.paid_by].paidTotal = Number(p.total);
  });

  // Calculate total owed per user
  const [owedRows] = await pool.query(
    `SELECT es.user_id, SUM(es.amount) as total
     FROM expense_splits es
     JOIN expenses e ON es.expense_id = e.id
     WHERE e.trip_id = ?
     GROUP BY es.user_id`,
    [tripId]
  );
  owedRows.forEach((o) => {
    if (balances[o.user_id]) balances[o.user_id].owedTotal = Number(o.total);
  });

  // Calculate Net
  Object.values(balances).forEach((b) => {
    b.netBalance = Number((b.paidTotal - b.owedTotal).toFixed(2));
  });

  return Object.values(balances);
};

// TRICKY SCENARIO #9: Settlement Validation
exports.settlePayment = async ({ trip_id, payee_id, amount }, payerId) => {
  // 1. Calculate how much payer owes payee in total
  const [owedRows] = await pool.query(
    `SELECT COALESCE(SUM(es.amount), 0) as total_owed
     FROM expense_splits es
     JOIN expenses e ON es.expense_id = e.id
     WHERE e.trip_id = ? AND es.user_id = ? AND e.paid_by = ?`,
    [trip_id, payerId, payee_id]
  );

  // 2. Subtract completed settlements
  const [settledRows] = await pool.query(
    `SELECT COALESCE(SUM(amount), 0) as total_settled
     FROM settlements
     WHERE trip_id = ? AND payer_id = ? AND payee_id = ? AND status = 'completed'`,
    [trip_id, payerId, payee_id]
  );

  const outstanding = owedRows[0].total_owed - settledRows[0].total_settled;

  if (amount > outstanding) {
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