const Groq = require("groq-sdk");
const { GoogleGenAI } = require("@google/genai");
const { SarvamAIClient } = require("sarvamai");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const sarvam = new SarvamAIClient({ apiKey: process.env.SARVAM_API_KEY });

const PROVIDERS = {
  groq: "groq",
  sarvam: "sarvam",
  gemini: "gemini",
};

const BASE_SYSTEM_INSTRUCTION = `You are a sharp, precise assistant.

Rules you never break:
- Answer only what was asked — nothing more, nothing less
- Be concise but complete — every word must earn its place
- Use simple, clean language — no fluff, no filler phrases like "Certainly!" or "Great question!"
- Format smartly — use bullet points or code blocks only when they genuinely aid clarity
- If the answer is one sentence, give one sentence
- Never summarize what you just said at the end

You may have prior conversation context available — use it silently as background to understand the user better, never reference it explicitly.`;

async function GenerateGroqResponse(chatHistory) {
  const chatCompletion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: BASE_SYSTEM_INSTRUCTION },
      ...chatHistory.map((msg) => ({
        role: msg.role,
        content: String(msg.content),
      })),
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  return chatCompletion.choices[0].message.content;
}

async function GenerateSarvamResponse(chatHistory) {
  // Sarvam does not support system role —
  // merge BASE_SYSTEM_INSTRUCTION into the first user message
  const nonSystemMessages = chatHistory.filter((msg) => msg.role !== "system");

  const messages = nonSystemMessages.map((msg, index) => {
    if (index === 0 && msg.role === "user") {
      return {
        role: "user",
        content: `${BASE_SYSTEM_INSTRUCTION}\n\n${msg.content}`,
      };
    }
    return { role: msg.role, content: String(msg.content) };
  });

  // Sarvam requires strict user → assistant alternation
  const alternated = [];
  let lastRole = null;

  for (const msg of messages) {
    if (msg.role === lastRole) {
      alternated[alternated.length - 1].content += `\n${msg.content}`;
    } else {
      alternated.push({ ...msg });
      lastRole = msg.role;
    }
  }

  if (alternated[0]?.role !== "user") {
    alternated.unshift({ role: "user", content: "Continue." });
  }

  const response = await sarvam.chat.completions({
    model: "sarvam-m",
    messages: alternated,
    reasoning_effort: null, // thinking completely disabled
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

async function GenerateGeminiResponse(chatHistory) {
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
      systemInstruction: BASE_SYSTEM_INSTRUCTION,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  return result.text.trim();
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
      console.warn(`[ai.service] Unknown provider "${provider}" — falling back to groq`);
      return await GenerateGroqResponse(chatHistory);
  }
}

module.exports = {
  GenerateAIResponse,
  GenerateVector,
  GenerateGroqResponse,
  GenerateSarvamResponse,
  GenerateGeminiResponse,
};