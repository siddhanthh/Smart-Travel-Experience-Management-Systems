const pool = require('../config/db.mysql');

exports.getUsers = async (req, res, next) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.status(200).json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Use registration endpoint to create users' });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { role, name, email } = req.body;
    const userId = req.params.id;

    await pool.query(
      `UPDATE users SET
         role = COALESCE(?, role),
         name = COALESCE(?, name),
         email = COALESCE(?, email)
       WHERE id = ?`,
      [role, name, email, userId]
    );

    res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if (Number(userId) === Number(req.user.id)) {
      return res.status(400).json({ message: 'You cannot delete your own admin account.' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};