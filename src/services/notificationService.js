const mongoose = require('mongoose')

const Notification = require('../models/notification');

const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      user_id: userId,
      message: message,
    });

    const savedNotification = await notification.save();
    return savedNotification;
  } catch (error) {
    throw new Error(`Error creating notification: ${error.message}`);
  }
};

const getUnreadNotifications = async (userId) => {
  try {
    const unreadNotifications = await Notification.find({ user_id: userId, status: 'unread' });
    return unreadNotifications;
  } catch (error) {
    throw new Error(`Error fetching unread notifications: ${error.message}`);
  }
};

const markNotificationsAsRead = async (notificationIds) => {
    try {
      const validNotificationIds = notificationIds.map((id) =>
        mongoose.Types.ObjectId.isValid(id) ? id : new mongoose.Types.ObjectId(id)
      );

      const result = await Notification.updateMany(
        { _id: { $in: validNotificationIds } },
        { $set: { status: 'read' } }
      );
  
      return result;
    } catch (error) {
      throw new Error(`Error marking notifications as read: ${error.message}`);
    }
  };

module.exports = {
    createNotification,
    getUnreadNotifications,
    markNotificationsAsRead
};
