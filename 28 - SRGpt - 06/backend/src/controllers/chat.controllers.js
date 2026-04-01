const chatModel = require("../models/chat.model");

async function createChat(req, res) {
  // get the title from user
  const { title } = req.body;
  const user = req.user;

  // create the chat
  const chat = await chatModel.create({
    user: user._id,
    title,
  });
  res.status(201).json({
    message: "Chat created successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      lastActivity: chat.lastActivity,
      user: chat.user
    },
  });
}

module.exports = {
  createChat,
};

