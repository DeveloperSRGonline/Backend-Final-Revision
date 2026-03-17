const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const {
  GenerateGroqResponse,
  GenerateVector,
} = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");
const { v4: uuidv4 } = require("uuid");

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
      // save user message
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      // generate user message vector
      const vectors = await GenerateVector(messagePayload.content);

      // save user message vector
      await createMemory({
        vectors,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id.toString(),
          text: messagePayload.content,
        },
        messageId: message._id,
      });

      // memory
      const memory = await queryMemory({
        queryVector:vectors,
        limit:3,
        metadata:{}
      });

      console.log("Memory : ",memory);

      // short term memory
      const chatHistory = await messageModel.find({
        chat: messagePayload.chat,
      });

      // generate ai response
      const response = await GenerateGroqResponse(
        chatHistory.map((msg) => ({
          role: msg.role,
          content: String(msg.content),
        })),
      );

      // if response not available
      if (!response) {
        return socket.emit("error", "AI returned empty response");
      }

      // save ai message
      const respnoseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "assistant",
      });

      // ai message vector
      const responseVectors = await GenerateVector(response);

      // save ai message vector
      await createMemory({
        vectors: responseVectors,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
        messageId: respnoseMessage._id,
      });

      // emit ai response
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
