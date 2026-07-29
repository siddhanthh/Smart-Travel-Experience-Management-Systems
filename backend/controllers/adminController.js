const pool = require('../config/db.mysql');
const AuditLog = require('../models/AuditLog');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[trips]] = await pool.query('SELECT COUNT(*) as totalTrips FROM trips');
    const [[bookings]] = await pool.query('SELECT COUNT(*) as totalBookings FROM bookings');
    const [[revenue]] = await pool.query('SELECT COALESCE(SUM(amount), 0) as totalVolume FROM expenses');

    res.status(200).json({
      data: {
        totalUsers: users.totalUsers,
        totalTrips: trips.totalTrips,
        totalBookings: bookings.totalBookings,
        totalExpenseVolume: revenue.totalVolume
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const userIds = [...new Set(logs.map((l) => l.userId).filter(Boolean))];
    let userMap = {};

    if (userIds.length > 0) {
      const [users] = await pool.query(
        `SELECT id, name, email FROM users WHERE id IN (${userIds.map(() => '?').join(',')})`,
        userIds
      );
      users.forEach((u) => {
        userMap[u.id] = u;
      });
    }

    const enrichedLogs = logs.map((log) => {
      const u = userMap[log.userId];
      return {
        ...log.toObject(),
        timestamp: log.createdAt || log.timestamp || new Date(),
        userName: u ? u.name : log.userId ? `User #${log.userId}` : 'System Admin',
        userEmail: u ? u.email : null,
      };
    });

    res.status(200).json({ data: enrichedLogs });
  } catch (err) {
    next(err);
  }
};