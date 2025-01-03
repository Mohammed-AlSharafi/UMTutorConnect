const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Student', 'Tutor'],
    required: true,
  },
});

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: participantSchema,
    required: true,
  },
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return this.parent().id;
    }
  },
});

const chatSchema = new mongoose.Schema({
  participants: [participantSchema],
  messages: [messageSchema],
  lastMessage: {    // so that most recent chats can be shown first
    type: Date,
    default: Date.now,
  },
  // read: {
  //   type: Boolean,
  //   default: false,
  // },
});

// find or create chats between 2 users
// ensures that the chat is unique between 2 users
chatSchema.statics.findOrCreateChat = async function (user1, user2) {
  const chat = await this.findOne({
    participants: {
      $all: [
        { $elemMatch: { id: user1._id, fullName: user1.fullName, role: user1.role } },
        { $elemMatch: { id: user2._id, fullName: user2.fullName, role: user2.role } },
      ],
    },
  });

  if (chat) {
    console.log(`Found chat between ${user1.fullName} and ${user2.fullName}`);
    return chat;
  }

  console.log(`Creating new chat between ${user1.fullName} and ${user2.fullName}`);
  const newChat = new this({
    participants: [
      { id: user1._id, fullName: user1.fullName, role: user1.role },
      { id: user2._id, fullName: user2.fullName, role: user2.role },
    ],
  });

  await newChat.save();
  return newChat;
};

// get all chats involving a user
chatSchema.statics.getChats = async function (userId) {
  const chats = await this.find({
    participants: {
      $elemMatch: {
        id: userId,
      },
    },
  }).sort({ lastMessage: -1 });

  // Add a 'name' field to represent the person the user is chatting with
  const newChats = chats.map(chat => {
    const otherParticipant = chat.participants.find(
      participant => participant.id.toString() !== userId
    );

    console.log(otherParticipant);
    return {
      ...chat.toObject(), // Convert Mongoose document to plain JS object
      fullName: otherParticipant?.fullName || "Unknown", // Add 'name' field
      otherParticipant: otherParticipant,
    };
  });

  console.log(`Found ${newChats.length} chats for user ${userId}`);
  console.log(newChats);
  return newChats;
};

// add message to chat
chatSchema.methods.addMessage = async function (content, sender) {
  this.messages.push({
    content,
    sender,
  });

  const newMessage = this.messages[this.messages.length - 1];
  this.lastMessage = newMessage.timestamp;    // update lastMessage time of chat so that latest chats can be shown first
  // this.read = false;    // set chat to unread
  await this.save();

  // return the newly added message
  return newMessage;
};

const chatModel = mongoose.model('Chat', chatSchema);
module.exports = chatModel;
