const User = require('../models/user');
const ResetToken = require('../models/resetToken');
const passport = require('passport');

exports.registerUser = async (userData) => {
  try {
    const newUser = new User(userData);
    return await User.register(newUser, userData.password);
  } catch (error) {
    throw error;
  }
};

exports.generateResetToken = async (user) => {
  // Generate a password reset token and save it in the database
  const token = require('crypto').randomBytes(32).toString('hex');
  const resetToken = new ResetToken({ userId: user._id, token });
  await resetToken.save();
  return token;
};

exports.verifyResetToken = async (token) => {
  // Verify if the reset token exists and is valid
  return ResetToken.findOne({ token });
};

exports.resetPassword = async (user, newPassword) => {
  // Reset the user's password
  user.setPassword(newPassword, (err) => {
    if (err) {
      throw err;
    }
    user.save();
  });
};
