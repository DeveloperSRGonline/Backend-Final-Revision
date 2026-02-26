const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "What is India's most powerful quality? Answer in one sentence.",
  });
  console.log(response.text);
}

main();