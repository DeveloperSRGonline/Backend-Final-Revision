const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const {
  GenerateGroqResponse,
  GenerateVector,
  GenerateAIResponse,
} = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");

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
      const { chatId, content, ai } = messagePayload;
      
      // save user message
      const message = await messageModel.create({
        chat: chatId,
        user: socket.user._id,
        content: content,
        role: "user",
      });

      // generate user message vector
      const vectors = await GenerateVector(content);

      // save user message vector
      await createMemory({
        vectors,
        metadata: {
          chat: chatId,
          user: socket.user._id.toString(),
          text: content,
        },
        messageId: message._id,
      });

      // query memory
      const memory = await queryMemory({
        queryVector: vectors,
        limit: 3,
        metadata: {
          chat: chatId,
          user: socket.user._id.toString(),
        },
      });

      // short term memory
      const chatHistory = (
        await messageModel
          .find({ chat: chatId })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((msg) => ({
        role: msg.role,
        content: String(msg.content),
      }));

      // long term memory
      const ltm = [
        {
          role: "system",
          content: `These are relevant messages from earlier in this conversation. Use them as context:\n${memory
            .map((item) => item.metadata.text)
            .join("\n")}`,
        },
      ];

      // generate ai response
      const response = await GenerateAIResponse([...ltm, ...stm], ai);

      // if response not available
      if (!response) {
        return socket.emit("error", "AI returned empty response");
      }

      // save ai message
      const respnoseMessage = await messageModel.create({
        chat: chatId,
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
          chat: chatId,
          user: socket.user._id,
          text: response,
        },
        messageId: respnoseMessage._id,
      });

      // emit ai response
      socket.emit("ai-response", {
        content: response,
        chat: chatId,
      });
    });
  });
}

module.exports = initSocketServer;
