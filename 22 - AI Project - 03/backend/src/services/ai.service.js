const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const { SarvamAIClient } = require('sarvamai');

// ── Initialize AI clients ──
const ai = new GoogleGenAI({});
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
const sarvamClient = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY,
});


// ── Gemini ──
async function GenerateAIResponse(chatHistory) {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: chatHistory.map(msg => ({
            role: msg.role === "assistant" ? "model" : msg.role,
            parts: [{ text: msg.content }]
        }))
    });
    return response.text;
}


// ── Groq (Llama) ──
async function GenerateGroqResponse(chatHistory) {
    const chatCompletion = await groq.chat.completions.create({
        messages: chatHistory.map(msg => ({
            role: msg.role,
            content: String(msg.content)   // Groq requires content to be a string
        })),
        model: "llama-3.3-70b-versatile",
    });

    return chatCompletion.choices[0].message.content;
}


// ── Sarvam AI ──
async function sarvamAIResponse(chatHistory) {
    const response = await sarvamClient.chat.completions({
        messages: [...chatHistory],
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1000,
    });

    return response.choices[0].message.content;
}


module.exports = {
    GenerateAIResponse,
    GenerateGroqResponse,
    sarvamAIResponse
};