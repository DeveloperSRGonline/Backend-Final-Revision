const Groq = require("groq-sdk");
const { GoogleGenAI } = require("@google/genai");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
const ai = new GoogleGenAI({
    apiKey:process.env.GEMINI_API_KEY
});

// ── Groq (Llama) ──
async function GenerateGroqResponse(chatHistory) {
  const chatCompletion = await groq.chat.completions.create({
    messages: chatHistory.map((msg) => ({
      role: msg.role,
      content: String(msg.content), // Groq requires content to be a string
    })),
    model: "llama-3.3-70b-versatile",
  });

  return chatCompletion.choices[0].message.content;
}

async function GenerateVector(content) {
  const response = await ai.models.embedContent({
    model:"gemini-embedding-001",
    contents:content,
    config:{
        outputDimensionality:768
    }
  })

  return response.embeddings[0].values
}

module.exports = {
    GenerateGroqResponse,
    GenerateVector
};
