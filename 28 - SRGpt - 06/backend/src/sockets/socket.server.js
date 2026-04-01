const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const { GenerateVector, GenerateAIResponse } = require("../services/ai.service");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  // ── Auth Middleware ───────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
      socket.user = await userModel.findById(decoded.id);
      next();
    } catch {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      const { chatId, content, ai } = messagePayload;

      // ── Phase 1: Independent ops run together ─────────────────────────────
      // saveUserMsg, generateVector, getChatHistory — no deps on each other
      const [message, vectors, chatHistory] = await Promise.all([
        messageModel.create({
          chat: chatId,
          user: socket.user._id,
          content,
          role: "user",
        }),
        GenerateVector(content),
        messageModel
          .find({ chat: chatId })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .then((msgs) => msgs.reverse()),
      ]);

      // ── Phase 2: Both need vector from Phase 1 ────────────────────────────
      // createMemory also needs messageId — both ready from Phase 1
      const [, memory] = await Promise.all([
        createMemory({
          vectors,
          metadata: {
            chat: chatId,
            user: socket.user._id.toString(),
            text: content,
          },
          messageId: message._id,
        }),
        queryMemory({
          queryVector: vectors,
          limit: 10,
          metadata: {
            user: socket.user._id.toString(),
          },
        }),
      ]);

      // ── Build context for AI ──────────────────────────────────────────────

      // short-term memory — recent chat history
      const stm = chatHistory.map((msg) => ({
        role: msg.role,
        content: String(msg.content),
      }));

      // long-term memory — injected as prior conversation context, not as instructions
      const ltm =
        memory.length > 0
          ? [
              {
                role: "user",
                content: `[Earlier conversation context — use as background only, do not reference directly]\n${memory
                  .map((item) => item.metadata.text)
                  .join("\n")}`,
              },
              {
                role: "assistant",
                content: "Understood, I have the context.",
              },
            ]
          : [];

      // ── Phase 3: Generate AI response ─────────────────────────────────────
      const aiResponse = await GenerateAIResponse([...ltm, ...stm], ai);

      if (!aiResponse) {
        return socket.emit("error", "AI returned empty response");
      }

      console.log(aiResponse);

      // ── Emit immediately — user gets response right now ───────────────────
      socket.emit("ai-response", {
        content: aiResponse,
        chat: chatId,
      });

      // ── Background: Persist AI response (fire & forget) ───────────────────
      // Runs after emit — user is not blocked by these saves
      (async () => {
        try {
          // save AI message in DB + generate its vector — both independent
          const [aiResponseMessage, aiResponseVectors] = await Promise.all([
            messageModel.create({
              chat: chatId,
              user: socket.user._id,
              content: aiResponse,
              role: "assistant",
            }),
            GenerateVector(aiResponse),
          ]);

          // save AI message vector in Pinecone — needs both messageId + vector
          await createMemory({
            vectors: aiResponseVectors,
            metadata: {
              chat: chatId,
              user: socket.user._id.toString(),
              text: aiResponse,
            },
            messageId: aiResponseMessage._id,
          });
        } catch (error) {
          // user already has their response — just log, don't disturb them
          console.error("[Background] Failed to persist AI response:", error);
        }
      })();
    });
  });
}

module.exports = initSocketServer;