const Groq = require('groq-sdk');
const { SarvamAIClient } = require("sarvamai");
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
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


module.exports = GenerateGroqResponse;
