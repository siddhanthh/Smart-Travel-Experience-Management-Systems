const Notification = require('../models/Notification');

exports.createNotification = async ({ userId, type, title, message, referenceId, referenceType }) => {
  const idempotencyKey = `${type}:${userId}:${referenceId || Date.now()}`;
  try {
    const notif = await Notification.create({
      userId,
      type,
      title,
      message,
      referenceId: String(referenceId),
      referenceType,
      idempotencyKey
    });
    return notif;
  } catch (err) {
    // Catch MongoDB duplicate key error silently
    if (err.code === 11000) {
      return null;
    }
    throw err;
  }
};

exports.getUserNotifications = async (userId, { page = 1, limit = 10 }) => {
  const skip = (Number(page) - 1) * Number(limit);
  const notifications = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const unreadCount = await Notification.countDocuments({ userId, isRead: false });

  return { data: notifications, unreadCount };
};

exports.markAsRead = async (notificationId, userId) => {
  await Notification.updateOne({ _id: notificationId, userId }, { isRead: true });
  return { message: 'Notification marked as read' };
};