const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    name: String,
    type: String,
    location: String,
    date: Object,
    time: Object,
    description: String,
    participants: Array,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: Date
})

module.exports = mongoose.model('Event', eventSchema);
