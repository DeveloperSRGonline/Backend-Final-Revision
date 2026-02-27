const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image. in one line only.use emojis if possible." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: contents,
    config:{
      systemInstruction:`
      You are a professional social media content creator. Your task is to generate engaging and creative captions for images.
      The captions should be short, catchy, and suitable for social media platforms.
      Use emojis when appropriate to make the caption more engaging.
      be inspirational and growth oriented.
      use hinglish language.
      Be creative and engaging.
      Keep it under 100 characters.
      Can use hastags if needed.
      `
    }
  });
  return response.text;
}


module.exports = {
  generateCaption
};
