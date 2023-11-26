const User = require('../models/user');
const chatService = require('../services/chatService')
const notificationService = require('../services/notificationService')

const s3 = require('../configs/aws')
const fs = require('fs');

function updateUser(userId, updateData) {
    return User.findByIdAndUpdate(userId, updateData, { new: true })
      .exec()
      .catch((err) => {
        console.error(err);
        return null; // Handle errors appropriately
      });
  }

const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Use passport-local-mongoose's authenticate method to verify the current password
    const isCurrentPasswordValid = await user.authenticate(currentPassword);

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Set the new password using passport-local-mongoose's setPassword method
    await user.setPassword(newPassword);

    // Save the updated user
    await user.save();

    return { message: 'Password updated successfully' };
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const getConnections = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const connectedUserIds = user.connections.map(connection => connection.user_id);

    const connectedUsers = await User.find({ _id: { $in: connectedUserIds } });

    return connectedUsers;
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const getSuggestions = async (userId, count) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const connectedUserIds = user.connections.map(connection => connection.user_id);
    const pendingRequestUserIds = user.connectionRequests
      .filter(request => request.status === 'pending')
      .map(request => request.targetUserId); // Change from 'user_id' to 'targetUserId'

    const sentRequestUserIds = user.connectionRequests
      .filter(request => request.status !== 'pending')
      .map(request => request.targetUserId); // Include all sent requests

   // Exclude already connected, users with pending requests, users I've already sent requests to, and myself
   const excludedUserIds = connectedUserIds.concat(pendingRequestUserIds).concat(sentRequestUserIds).concat(userId);

   // Get suggestions based on academicInfo conditions
   const suggestions = await User.find({
     _id: { $nin: excludedUserIds },
     'academicInfo.intakeYear': user.academicInfo.intakeYear - 1,
     'academicInfo.school': user.academicInfo.school,
     'academicInfo.fieldOfStudy': user.academicInfo.fieldOfStudy
   }).limit(count);

    return suggestions;
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const sendConnectionRequest = async(userId, targetUserId) => {
  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      throw new Error('User not found');
    }

    // Check if a connection request already exists
    const existingRequest = user.connectionRequests.find(
      request => request.targetUserId.toString() === targetUserId
    );

    if (existingRequest) {
      throw new Error('Connection request already sent');
    }

    // Add a connection request to the requester's list
    user.connectionRequests.push({
      targetUserId: targetUser._id,
      status: 'pending',
    });

    // Add a connection request to the target's list
    targetUser.connectionRequests.push({
      senderUserId: user._id,
      status: 'pending',
    });

    await user.save();
    await targetUser.save();

    notificationService.createNotification(
      targetUser._id,
      `${user.firstName} ${user.lastName} has sent you a request`
    )

    return { message: 'Connection request sent' };
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const acceptConnectionRequest = async (userId, requesterId) => {
  try {
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      throw new Error('User not found');
    }

    // Check if there is a pending connection request
    const pendingRequest = user.connectionRequests.find(
      request => request.senderUserId.toString() === requesterId && request.status === 'pending'
    );

    if (!pendingRequest) {
      throw new Error('No pending connection request from this user');
    }

    // Update the status of the connection request to 'accepted'
    pendingRequest.status = 'accepted';

    // Add a connection to the user's list
    user.connections.push({
      user_id: requester._id,
      status: 'connected',
    });

    requester.connections.push({
      user_id: user._id,
      status: 'connected',
    });

    // Remove the connection request
    user.connectionRequests = user.connectionRequests.filter(
      request => request.senderUserId.toString() !== requesterId
    );

    await user.save();
    await requester.save();

    notificationService.createNotification(
      requester._id,
      `${user.firstName} ${user.lastName} has accepted your request.`
    )

    chatService.createChat([user._id.toString(), requester._id.toString()])

    return { message: 'Connection request accepted' };
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const getPendingConnectionRequests = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch pending connection requests where the current user is the target
    const pendingRequests = user.connectionRequests.filter(request => request.status === 'pending');

    const senderUserIds = pendingRequests.map(request => request.senderUserId);

    // Use the targetUserIds in the query to get the requesters
    const requesters = await User.find({ _id: { $in: senderUserIds } });

    return requesters
  } catch (error) {
    throw new Error(`Error in UserService: ${error.message}`);
  }
}

const uploadPhoto = async (file) => {
  fileToBuffer(file, async (error, buffer) => {
    if (error) {
      console.error('Error converting file to buffer:', error);
    } else {
      console.log('herer')
      const params = {
        Bucket: 'ait-collab',
        Key: file.originalname,
        Body: buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      };

      const result = await s3.upload(params).promise();
      return result.Location;
    }
  });

  return true
}

function fileToBuffer(file, callback) {
  fs.readFile(file.path)
    .then(data => {
      const buffer = Buffer.from(data);
      callback(null, buffer);
    })
    .catch(error => {
      callback(error, null);
    });
}

module.exports = {
  getConnections,
  getSuggestions,
  sendConnectionRequest,
  acceptConnectionRequest,
  getPendingConnectionRequests,
  updateUser,
  uploadPhoto,
  updatePassword
};
