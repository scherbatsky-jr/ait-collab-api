const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    dateOfBirth: Date,
    gender: String,
    nationality: String,
    mentor: { type: Boolean, default: false},
    academicInfo: {
        intakeYear: Number,
        intakeMonth: String,
        school: String,
        program: String,
        fieldOfStudy: String
    },
    connections: [
        {
          user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          mentor: Boolean,
        },
    ],
    connectionRequests: [
        {
          targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          status: { type: String, enum: ['pending', 'accepted'] },
        },
      ],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
