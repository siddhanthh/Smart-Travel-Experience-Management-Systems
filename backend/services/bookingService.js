const pool = require('../config/db.mysql');
const { AppError } = require('../middleware/errorHandler');

exports.createBooking = async (bookingData, userId) => {
  try {
    // 1. Check if trip exists and is active
    const [trips] = await pool.query('SELECT status FROM trips WHERE id = ?', [bookingData.trip_id]);
    if (trips.length === 0) {
      throw new AppError('Trip not found', 404);
    }
    if (trips[0].status === 'cancelled') {
      throw new AppError('Cannot create bookings for a cancelled trip', 400);
    }

    // 2. Insert booking
    const [result] = await pool.query(
      `INSERT INTO bookings (trip_id, user_id, type, title, description, amount, booking_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingData.trip_id,
        userId,
        bookingData.type,
        bookingData.title,
        bookingData.description || null,
        bookingData.amount,
        bookingData.booking_date
      ]
    );

    return { id: result.insertId, ...bookingData, user_id: userId, status: 'pending' };
  } catch (err) {
    // TRICKY SCENARIO #2: Catch unique constraint error on (trip_id, user_id, type, booking_date)
    if (err.code === 'ER_DUP_ENTRY') {
      throw new AppError('A booking of this type on this date already exists for you on this trip.', 409);
    }
    throw err;
  }
};

exports.getTripBookings = async (tripId) => {
  const [bookings] = await pool.query(
    `SELECT b.*, u.name as booked_by_name, u.email as booked_by_email
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     WHERE b.trip_id = ?
     ORDER BY b.booking_date ASC`,
    [tripId]
  );
  return bookings;
};

exports.getBookingById = async (bookingId) => {
  const [bookings] = await pool.query(
    `SELECT b.*, u.name as booked_by_name
     FROM bookings b
     JOIN users u ON b.user_id = u.id
     WHERE b.id = ?`,
    [bookingId]
  );
  if (bookings.length === 0) {
    throw new AppError('Booking not found', 404);
  }
  return bookings[0];
};

exports.cancelBooking = async (bookingId, userId, userRole) => {
  const [bookings] = await pool.query('SELECT user_id, status FROM bookings WHERE id = ?', [bookingId]);
  if (bookings.length === 0) {
    throw new AppError('Booking not found', 404);
  }

  // Authorization check: only booking owner or admin can cancel
  if (bookings[0].user_id !== userId && userRole !== 'admin') {
    throw new AppError('Unauthorized to cancel this booking', 403);
  }

  await pool.query('UPDATE bookings SET status = "cancelled" WHERE id = ?', [bookingId]);
  return { message: 'Booking cancelled successfully' };
};