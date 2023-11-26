// notification.controller.js

const notificationService = require('../services/notificationService');

const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;
    const savedNotification = await notificationService.createNotification(userId, message);
    res.json(savedNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    const unreadNotifications = await notificationService.getUnreadNotifications(userId);
    res.json(unreadNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markNotificationsAsRead = async (req, res) => {
    try {
      const notificationIds = req.body.notificationIds;
      const result = await notificationService.markNotificationsAsRead(notificationIds);
      res.json({ message: `${result.nModified} notifications marked as read` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = { createNotification, getUnreadNotifications, markNotificationsAsRead };
