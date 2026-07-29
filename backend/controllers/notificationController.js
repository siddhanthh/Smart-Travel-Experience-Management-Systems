const notificationService = require('../services/notificationService');

exports.getNotifications = async (req, res, next) => {
  try {
    const result = await notificationService.getUserNotifications(req.user.id, req.query);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAsRead(req.params.id, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.markAllRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};