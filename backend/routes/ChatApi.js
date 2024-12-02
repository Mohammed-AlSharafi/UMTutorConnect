const express = require('express');
const router = express.Router();

// import Chat model
const chatModel = require('../schemas/Chat');


// set routes

// get all chats involving a user
router.get('/chats/:userRole/:userId', async (req, res) => {
  const userId = req.params.userId;
  const userRole = req.params.userRole;

  console.log(`Getting chats for user ${userId} with role ${userRole}`);

  try {
    // get chats involving the user from the database
    const chats = await chatModel.getChats(userId);
    res.status(200).json({ chats: chats });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post('/chats/:chatId/messages', async (req, res) => {
  const chatId = req.params.chatId;
  const user = req.body.user;
  const content = req.body.content;

  console.log(`Adding message to chat ${chatId} from user ${user._id}`);

  try {
    // add message to chat
    const chat = await chatModel.findById(chatId);

    const sender = { id: user._id, username: user.username, role: user.role };
    const message = await chat.addMessage(content, sender);
    console.log(message);

    res.status(200).json({ message: message });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;