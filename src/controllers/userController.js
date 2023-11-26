const userService = require('../services/userService');

function updateUser(req, res) {
  const userId = req.user.userId;
  const updateData = req.body;

  userService.updateUser(userId, updateData)
    .then((response) => {
        res.json(response)
    })
}

const updatePassword = async (req, res) => {
  const userId = req.user.userId
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await userService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getConnections = (req, res) => {
  const userId = req.user.userId

  userService.getConnections(userId)
    .then(response => {
      res.json({ connections: response})
    })
}

const getSuggestions = async (req, res) => {
  const userId = req.user.userId
  const count = req.params.count

  try {
    const suggestions = await userService.getSuggestions(userId, count);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const sendConnectionRequest= async (req, res) => {
  try {
    const userId = req.user.userId
    const targetUserId = req.body.targetUserId;

    const result = await userService.sendConnectionRequest(userId, targetUserId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const acceptConnectionRequest = async (req, res) => {
  try {
    const userId = req.user.userId
    const requesterId = req.body.requesterId;

    const result = await userService.acceptConnectionRequest(userId, requesterId);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getPendingConnectionRequests = async (req, res) => {
  try {
    const userId = req.user.userId

    const pendingRequests = await userService.getPendingConnectionRequests(userId);

    res.status(200).json(pendingRequests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const uploadPhoto = async(req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const imageUrl = await userService.uploadPhoto(file);

    res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  updateUser,
  getConnections,
  getSuggestions,
  sendConnectionRequest,
  getPendingConnectionRequests,
  acceptConnectionRequest,
  uploadPhoto,
  updatePassword
};
