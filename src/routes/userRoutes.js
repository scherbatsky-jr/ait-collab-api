const express = require('express');
const router = express.Router();
const multer = require('multer');

const userController = require('../controllers/userController')
const notificationController = require('../controllers/notificationController')

const storage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

router.post('/update', userController.updateUser);
router.get('/connections', userController.getConnections)
router.get('/suggestions/:count', userController.getSuggestions);
router.post('/update-password', userController.updatePassword);

router.post('/send-connection-request', userController.sendConnectionRequest);
router.post('/accept-connection-request', userController.acceptConnectionRequest);
router.get('/pending-connection-requests', userController.getPendingConnectionRequests);

router.post('/upload', upload.single('photo'), userController.uploadPhoto);

router.get('/unread-notifications', notificationController.getUnreadNotifications);
router.post('/notifications/mark-as-read', notificationController.markNotificationsAsRead);

module.exports = router;
