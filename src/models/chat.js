const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    users: Array,
    messages: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            message: String,
            createdAt: Date
        }
    ],
})

module.exports = mongoose.model('Chat', chatSchema);
