const { GoogleGenAI } = require('@google/genai');
const Groq = require('groq-sdk');
const { SarvamAIClient } = require('sarvamai');

const ai = new GoogleGenAI({});
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
// Initialize the SarvamAI client with your API key
const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

async function GenerateAIResponse(prompt){
    const response = await ai.models.generateContent({
        model:"gemini-2.0-flash",
        contents:prompt
    })
    return response.text;
}


async function GenerateGroqResponse(prompt) {
    const chatCompletion = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        // You can use llama-3.1-8b-instant for even higher speed
        model: "llama-3.3-70b-versatile",
    });

    // Return just the message content
    return chatCompletion.choices[0].message.content;
}


async function sarvamAIResponse(prompt) {
    const response = await client.chat.completions({
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 0.5,
        top_p: 1,
        max_tokens: 1000,
    });

    // Return the assistant's reply
    return response.choices[0].message.content;
}




module.exports = {
    GenerateAIResponse,
    GenerateGroqResponse,
    sarvamAIResponse
};