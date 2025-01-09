const mongoose = require('mongoose');
const { studentModel } = require('./Student');
const tutorModel = require('./Tutor');

const participantSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
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
        { $elemMatch: { id: user1._id, role: user1.role } },
        { $elemMatch: { id: user2._id, role: user2.role } },
      ],
    },
  }).lean();

  if (chat) {
    console.log(`Found chat between ${user1.fullName} and ${user2.fullName}`);

    // populate the participants before returning
    chat.participants = await populateParticipants(chat.participants);
    return chat;
  }

  console.log(`Creating new chat between ${user1.fullName} and ${user2.fullName}`);
  const newChat = new this({
    participants: [
      { id: user1._id, role: user1.role },
      { id: user2._id, role: user2.role },
    ],
  });

  await newChat.save();

  // populate the participants before returning
  const returnedChat = newChat.toObject();
  returnedChat.participants = await populateParticipants(returnedChat.participants);
  return returnedChat;
};

// get all chats involving a user
chatSchema.statics.getChats = async function (userId) {
  const chats = await this.find({
    participants: {
      $elemMatch: {
        id: userId,
      },
    },
  }).sort({ lastMessage: -1 })
    .lean();

  // populate the participants before returning
  for (let chat of chats) {
    chat.participants = await populateParticipants(chat.participants);
  }

  // Add a 'name' field to represent the person the user is chatting with
  const newChats = chats.map(chat => {
    const otherParticipant = chat.participants.find(
      participant => participant.id.toString() !== userId
    );

    console.log("other:", otherParticipant);

    return {
      ...chat,
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

  // populate the sender before returning
  const returnedMessage = newMessage.toObject();
  returnedMessage.sender = await populateParticipant(returnedMessage.sender);

  // return the newly added message
  return returnedMessage;
};

// populate participant based on role
async function populateParticipant(participant) {
  const model = participant.role === 'Student' ? studentModel : tutorModel;

  const data = await model.findById(participant.id).lean();
  return { ...data, role: participant.role, id: participant.id };
}

// populate all participants in a chat based on their role
async function populateParticipants(participants) {
  return await Promise.all(
    participants.map(async (participant) => {
      const model = participant.role === 'Student' ? studentModel : tutorModel;

      const data = await model.findById(participant.id).lean();
      return { ...data, role: participant.role, id: participant.id };
    })
  );
}


const chatModel = mongoose.model('Chat', chatSchema);
module.exports = chatModel;
