const pool = require('../config/db.mysql');

exports.searchTrips = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const offset = (Number(page) - 1) * Number(limit);
    const searchTerm = `%${q}%`;

    const [trips] = await pool.query(
      `SELECT id, title, description, destination, start_date, end_date, status
       FROM trips
       WHERE title LIKE ? OR destination LIKE ? OR description LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, searchTerm, Number(limit), offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM trips WHERE title LIKE ? OR destination LIKE ? OR description LIKE ?`,
      [searchTerm, searchTerm, searchTerm]
    );

    res.status(200).json({
      data: trips,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const offset = (Number(page) - 1) * Number(limit);
    const searchTerm = `%${q}%`;

    const [users] = await pool.query(
      `SELECT id, name, email, role FROM users
       WHERE name LIKE ? OR email LIKE ?
       LIMIT ? OFFSET ?`,
      [searchTerm, searchTerm, Number(limit), offset]
    );

    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};