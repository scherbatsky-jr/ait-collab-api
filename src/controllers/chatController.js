const chatService = require('../services/chatService')

const getChatIds = (req, res) => {
    const userId = req.user.userId;

    chatService.getChatIds(userId)
        .then((response) => {
            res.json(response)
        })
}

const getChatMessages = (req, res) => {
    const chatId = req.body.chatId

    chatService.getChatMessages(chatId)
        .then((response) => {
            res.json(response)
        })
}

module.exports = {
    getChatIds,
    getChatMessages
}