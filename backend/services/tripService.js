const pool = require('../config/db.mysql');
const { AppError } = require('../middleware/errorHandler');

exports.createTrip = async (tripData, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert Trip
    const [result] = await connection.query(
      `INSERT INTO trips (title, description, destination, start_date, end_date, max_members, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tripData.title,
        tripData.description || null,
        tripData.destination,
        tripData.start_date,
        tripData.end_date,
        tripData.max_members || 10,
        userId
      ]
    );

    const tripId = result.insertId;

    // 2. Add Creator as Organizer in trip_members
    await connection.query(
      `INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, 'organizer')`,
      [tripId, userId]
    );

    await connection.commit();
    return { id: tripId, ...tripData, created_by: userId, status: 'planning' };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.getTrips = async ({ page = 1, limit = 10, destination, status, search, mine, userId }) => {
  const offset = (Number(page) - 1) * Number(limit);
  let whereClause = ' WHERE 1=1';
  const queryParams = [];

  if (destination) {
    whereClause += ' AND t.destination LIKE ?';
    queryParams.push(`%${destination}%`);
  }
  if (status) {
    whereClause += ' AND t.status = ?';
    queryParams.push(status);
  }
  if (search) {
    whereClause += ' AND (t.title LIKE ? OR t.description LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }
  if (mine && userId) {
    whereClause += ' AND (t.created_by = ? OR EXISTS (SELECT 1 FROM trip_members tm WHERE tm.trip_id = t.id AND tm.user_id = ?))';
    queryParams.push(userId, userId);
  }

  const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM trips t ${whereClause}`, queryParams);
  const total = countRows[0].total;

  const dataQuery = `
    SELECT t.*, (SELECT COUNT(*) FROM trip_members tm WHERE tm.trip_id = t.id) as member_count
    FROM trips t
    ${whereClause}
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `;
  const [trips] = await pool.query(dataQuery, [...queryParams, Number(limit), offset]);

  return {
    data: trips,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.getTripById = async (tripId) => {
  const [trips] = await pool.query('SELECT * FROM trips WHERE id = ?', [tripId]);
  if (trips.length === 0) {
    throw new AppError('Trip not found', 404);
  }

  // Fetch members
  const [members] = await pool.query(
    `SELECT tm.id, tm.user_id, tm.role, tm.joined_at, u.name, u.email
     FROM trip_members tm
     JOIN users u ON tm.user_id = u.id
     WHERE tm.trip_id = ?`,
    [tripId]
  );

  return { ...trips[0], members };
};

// TRICKY SCENARIO #1: Concurrent Trip Joining using Row Locking
exports.joinTrip = async (tripId, userId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Lock the trip row so concurrent requests wait
    const [trips] = await connection.query(
      'SELECT max_members, status FROM trips WHERE id = ? FOR UPDATE',
      [tripId]
    );

    if (trips.length === 0) {
      throw new AppError('Trip not found', 404);
    }

    if (trips[0].status === 'cancelled') {
      throw new AppError('Cannot join a cancelled trip', 400);
    }

    // 2. Check if user is already a member
    const [existing] = await connection.query(
      'SELECT id FROM trip_members WHERE trip_id = ? AND user_id = ?',
      [tripId, userId]
    );
    if (existing.length > 0) {
      throw new AppError('You are already a member of this trip', 409);
    }

    // 3. Count current members
    const [members] = await connection.query(
      'SELECT COUNT(*) as count FROM trip_members WHERE trip_id = ?',
      [tripId]
    );

    if (members[0].count >= trips[0].max_members) {
      throw new AppError('Trip is full', 409);
    }

    // 4. Safely add member
    await connection.query(
      'INSERT INTO trip_members (trip_id, user_id, role) VALUES (?, ?, "member")',
      [tripId, userId]
    );

    await connection.commit();
    return { message: 'Successfully joined the trip' };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

// TRICKY SCENARIO #4: Trip Cancellation Handling (Cascades to bookings)
exports.cancelTrip = async (tripId, userId, userRole) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Verify ownership or admin
    const [trips] = await connection.query('SELECT created_by, status FROM trips WHERE id = ?', [tripId]);
    if (trips.length === 0) throw new AppError('Trip not found', 404);

    if (trips[0].created_by !== userId && userRole !== 'admin') {
      throw new AppError('Unauthorized to cancel this trip', 403);
    }

    // Update trip status to cancelled
    await connection.query('UPDATE trips SET status = "cancelled" WHERE id = ?', [tripId]);

    // Cascade cancellation to all non-cancelled bookings for this trip
    await connection.query(
      'UPDATE bookings SET status = "cancelled" WHERE trip_id = ? AND status != "cancelled"',
      [tripId]
    );

    await connection.commit();
    return { message: 'Trip and associated bookings cancelled successfully' };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

exports.getTripMembers = async (tripId) => {
  const [members] = await pool.query(
    `SELECT tm.id, tm.user_id, tm.role, tm.joined_at, u.name, u.email
     FROM trip_members tm
     JOIN users u ON tm.user_id = u.id
     WHERE tm.trip_id = ?`,
    [tripId]
  );
  return { members };
};

exports.updateTrip = async (tripId, tripData, userId, userRole) => {
  const [trips] = await pool.query('SELECT created_by FROM trips WHERE id = ?', [tripId]);
  if (trips.length === 0) throw new AppError('Trip not found', 404);
  if (trips[0].created_by !== userId && userRole !== 'admin') {
    throw new AppError('Unauthorized to update this trip', 403);
  }

  const { title, description, destination, start_date, end_date, max_members, status } = tripData;
  await pool.query(
    `UPDATE trips SET
       title = COALESCE(?, title),
       description = COALESCE(?, description),
       destination = COALESCE(?, destination),
       start_date = COALESCE(?, start_date),
       end_date = COALESCE(?, end_date),
       max_members = COALESCE(?, max_members),
       status = COALESCE(?, status)
     WHERE id = ?`,
    [title, description, destination, start_date, end_date, max_members, status, tripId]
  );
  return { message: 'Trip updated successfully' };
};

exports.deleteTrip = async (tripId, userId, userRole) => {
  const [trips] = await pool.query('SELECT created_by FROM trips WHERE id = ?', [tripId]);
  if (trips.length === 0) throw new AppError('Trip not found', 404);
  if (trips[0].created_by !== userId && userRole !== 'admin') {
    throw new AppError('Unauthorized to delete this trip', 403);
  }
  await pool.query('DELETE FROM trips WHERE id = ?', [tripId]);
  return { message: 'Trip deleted successfully' };
};

exports.leaveTrip = async (tripId, userId) => {
  const [trips] = await pool.query('SELECT created_by FROM trips WHERE id = ?', [tripId]);
  if (trips.length === 0) throw new AppError('Trip not found', 404);

  if (Number(trips[0].created_by) === Number(userId)) {
    throw new AppError('The trip organizer cannot leave the trip. You can cancel or delete the trip instead.', 400);
  }

  const [result] = await pool.query(
    'DELETE FROM trip_members WHERE trip_id = ? AND user_id = ?',
    [tripId, userId]
  );

  if (result.affectedRows === 0) {
    throw new AppError('You are not a member of this trip.', 400);
  }

  return { message: 'Successfully left the trip' };
};