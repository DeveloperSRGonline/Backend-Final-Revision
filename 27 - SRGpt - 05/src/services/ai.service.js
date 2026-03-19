const Groq = require("groq-sdk");
const { GoogleGenAI } = require("@google/genai");
const {SarvamAIClient} = require("sarvamai");


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sarvam = new SarvamAIClient({
  apiKey: process.env.SARVAM_API_KEY,
});


const PROVIDERS = {
  groq: "groq",
  sarvam: "sarvam",
  gemini: "gemini",
};

async function GenerateGroqResponse(chatHistory) {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: chatHistory.map((msg) => ({
      role: msg.role,
      content: String(msg.content),
    })),
    temperature: 0.7,
    max_tokens: 1024,
  });

  return chatCompletion.choices[0].message.content;
}


async function GenerateSarvamResponse(chatHistory) {
  const response = await sarvam.chat.completions({
    model: "sarvam-m",
    messages: chatHistory.map((msg) => ({
      role: msg.role,
      content: String(msg.content),
    })),
    temperature: 0.7,
    max_tokens: 1024,
  });
 
  return response.choices[0].message.content;
}

async function GenerateGeminiResponse(chatHistory) {
  const systemMsg = chatHistory.find((msg) => msg.role === "system");

  const contents = chatHistory
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content) }],
    }));

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      ...(systemMsg && { systemInstruction: systemMsg.content }),
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return result.text;
}
async function GenerateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: { outputDimensionality: 768 },
  });

  return response.embeddings[0].values;
}

async function GenerateAIResponse(chatHistory, provider = PROVIDERS.groq) {
  const normalizedProvider = provider?.toLowerCase().trim();

  switch (normalizedProvider) {
    case PROVIDERS.groq:
      return await GenerateGroqResponse(chatHistory);

    case PROVIDERS.sarvam:
      return await GenerateSarvamResponse(chatHistory);

    case PROVIDERS.gemini:
      return await GenerateGeminiResponse(chatHistory);

    default:
      console.warn(
        `[ai.service] Unknown provider "${provider}" — falling back to groq`
      );
      return await GenerateGroqResponse(chatHistory);
  }
}

module.exports = {
  GenerateAIResponse, // ← only this needed in socket.server.js
  GenerateVector,
  // individual exports kept for direct use/testing
  GenerateGroqResponse,
  GenerateSarvamResponse,
  GenerateGeminiResponse,
};