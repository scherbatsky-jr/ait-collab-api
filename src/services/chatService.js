const chat = require('../models/chat');
const Chat = require('../models/chat');
const User = require('../models/user');

const getChatIds = async (userId) => {
    try {
        const userChats = await Chat.find({ users: userId })

        const formattedChats = await Promise.all(userChats.map( async(chat) => {
            // Find the other user in the chat
        const otherUserId = chat.users.find(id => id !== userId);

        // Fetch the other user's information
        const otherUser = await User.findById(otherUserId, 'id firstName lastName');

        const lastMessage = chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1]
                : null;

        return {
            id: chat._id,
            otherUser: {
                id: otherUser._id,
                firstName: otherUser.firstName,
                lastName: otherUser.lastName
            },
            lastMessage: lastMessage
                    ? {
                        user_id: lastMessage.user_id,
                        message: lastMessage.message,
                        createdAt: lastMessage.createdAt
                    }
                    : null
        };
        }))

        const sortedChats = formattedChats.sort((a, b) => {
            if (!a.lastMessage && !b.lastMessage) return 0;
            if (!a.lastMessage) return 1;
            if (!b.lastMessage) return -1;
            return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
        });

        return sortedChats;
    } catch (err) {
        throw err
    }
}

const getChatMessages = async (chatId) => {
    try {
        const chat = await Chat.findById(chatId);
        
        const sortedMessages = chat.messages.sort((a, b) => b.createdAt - a.createdAt);
    
        return sortedMessages;
      } catch (err) {
        throw err;
      }
}

const addMessage = async (data) => {
    try {
        return Chat.findByIdAndUpdate(data.chatId, {
            $push: {
                messages: {
                    userId: data.userId,
                    message: data.message,
                    createdAt: Date.now()
                }
            },
        },
        {
            new: true
        }).exec()
    } catch (err) {
        throw err
    }
}

const createChat = async (userIds) => {
    try {
        const chat = new Chat({users: userIds, messages: []})

        chat.save()
    } catch (err) {
        throw err
    }
}

module.exports = {
    addMessage,
    getChatIds,
    getChatMessages,
    createChat
}
