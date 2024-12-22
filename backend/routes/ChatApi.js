const express = require('express');
const router = express.Router();
const { authMiddleware } = require("./middleware/AuthMiddleware");

// import Chat model
const chatModel = require('../schemas/Chat');

// initialize Pusher
const Pusher = require("pusher");
const pusher = new Pusher({
  appId: process.env.APP_ID,
  key: process.env.KEY,
  secret: process.env.SECRET,
  cluster: process.env.CLUSTER,
  useTLS: true
});

// set routes


// send message to a chat
// use authMiddleware as this is a private route
router.post('/chats/:chatId/sendMessage', authMiddleware, async (req, res) => {
  const chatId = req.params.chatId;
  const user = req.body.user;
  const content = req.body.content;

  console.log(`Adding message to chat ${chatId} from user ${user._id}`);

  try {
    const chat = await chatModel.findById(chatId);

    // Check if chat exists
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user participation in the chat
    const isUserInChat = chat.participants.some(
      participant => participant.id.toString() === req.user.id
    );
    if (!isUserInChat) {  //  && req.user.role !== 'admin'
      return res.status(403).json({ message: "Unauthorized to send messages in this chat" });
    }

    // prepare sender info following participant schema
    const sender = {
      id: req.user.id,
      fullName: req.user.fullName,
      role: req.user.role
    };

    // add message
    const message = await chat.addMessage(content, sender);
    console.log(message);

    // trigger event to pusher
    pusher.trigger("chats", "send-message-event", {
      message,
    }).then(() => {
      console.log("Message sent successfully");
    }).catch((error) => {
      console.error("Error sending message:", error);
    });

    res.status(200).json({ message: message });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get chat between two users
// use authMiddleware as this is a private route
router.get('/chats', authMiddleware, async (req, res) => {
  const user1 = req.query.user1;
  const user2 = req.query.user2;

  console.log("user1: ", user1);
  console.log("user2: ", user2);
  console.log("Getting chat between user1 and user2");

  try {
    const chat = await chatModel.findOrCreateChat(user1, user2);
    res.status(200).json({ chat: chat });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// get all chats involving a user
// use authMiddleware as this is a private route
router.get('/chats/:userRole/:userId', authMiddleware, async (req, res) => {
  const userId = req.params.userId;
  const userRole = req.params.userRole;

  console.log(`Getting chats for user ${userId} with role ${userRole}`);

  try {
    // Verify that the authenticated user matches the requested user ID
    if (req.user.id !== userId) {   // && req.user.role !== 'admin'
      return res.status(403).json({ message: "Unauthorized to access these chats" });
    }

    const chats = await chatModel.getChats(userId);
    res.status(200).json({ chats: chats });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;