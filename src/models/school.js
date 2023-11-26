const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    name: String,
    code: String,
    fieldOfStudies: Array
});

module.exports = mongoose.model('School', schoolSchema);
