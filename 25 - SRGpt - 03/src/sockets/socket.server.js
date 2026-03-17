const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const GenerateGroqResponse = require("../services/ai.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // middleware
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");


    // if token is not available in cookies
    if (!cookies.token) {
      next(new Error("Authentication error : No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error : No token provided"));
    }
  });

  io.on("connection", async (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      console.log("User message:", messagePayload.content);

      // message save of user
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      const chatHistory = await messageModel.find({
        chat: messagePayload.chat,
      });

      const response = await GenerateGroqResponse(
        chatHistory.map((msg) => ({
          role: msg.role,
          content: String(msg.content),
        })),
      );

      if (!response) {
        return socket.emit("error", "AI returned empty response");
      }
      // message save of ai
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "assistant",
      });

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
