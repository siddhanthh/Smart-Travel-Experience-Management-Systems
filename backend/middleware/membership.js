const pool = require('../config/db.mysql');

exports.isTripMember = async (req, res, next) => {
  try {
    const tripId = req.params.tripId || req.body.trip_id || req.query.trip_id;
    
    if (!tripId) {
      return res.status(400).json({ error: 'Trip ID is required for authorization.' });
    }

    const [rows] = await pool.query(
      'SELECT role FROM trip_members WHERE trip_id = ? AND user_id = ?',
      [tripId, req.user.id]
    );

    if (rows.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. You are not a member of this trip.' });
    }

    req.memberRole = rows[0]?.role || 'admin';
    next();
  } catch (err) {
    next(err);
  }
};