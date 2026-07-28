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

exports.getTrips = async ({ page = 1, limit = 10, destination, status, search }) => {
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM trips WHERE 1=1';
  const queryParams = [];

  if (destination) {
    query += ' AND destination LIKE ?';
    queryParams.push(`%${destination}%`);
  }
  if (status) {
    query += ' AND status = ?';
    queryParams.push(status);
  }
  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    queryParams.push(`%${search}%`, `%${search}%`);
  }

  // Count total matching records for pagination metadata
  const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
  const [countRows] = await pool.query(countQuery, queryParams);
  const total = countRows[0].total;

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  queryParams.push(Number(limit), Number(offset));

  const [trips] = await pool.query(query, queryParams);

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