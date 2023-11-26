const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController')

router.get('/ids', chatController.getChatIds)
router.post('/messages', chatController.getChatMessages)

module.exports = router;
