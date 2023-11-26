const User = require('../models/user');
const authService = require('../services/authService');
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const newUser = await authService.registerUser(req.body);
    req.login(newUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(400).json({ message: 'Registration and login failed.' });
      }
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
      return res.json({ message: 'Registration and login successful.', user: newUser, access_token: token });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Registration failed.' });
  }
};

exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Login failed.' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Login failed.' });
    }
    req.login(user, (err) => {
      if (err) {
        console.error(err);
        return res.status(401).json({ message: 'Login failed.' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});

      return res.json({ message: 'Login successful.', user, access_token: token});
    });
  })(req, res, next);
};

exports.requestPasswordReset = async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const token = await authService.generateResetToken(user);

  // Send the reset token to the user via email or other means
  // You can implement your logic to send the token.

  res.json({ message: 'Password reset token sent successfully' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const resetToken = await authService.verifyResetToken(token);

  if (!resetToken) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const user = await User.findById(resetToken.userId);
  await authService.resetPassword(user, newPassword);

  res.json({ message: 'Password reset successful' });
};
