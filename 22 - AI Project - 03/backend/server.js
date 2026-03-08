require('dotenv').config();
const app = require("./src/app");
const { createServer } = require('http');
const { Server } = require('socket.io');
const {
    GenerateAIResponse,
    GenerateGroqResponse,
    sarvamAIResponse
} = require('./src/services/ai.service');

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

// Chat history per socket (short-term memory)
io.on('connection', (socket) => {
    console.log('a user connected');

    let chatHistory = [];

    socket.on('disconnect', () => {
        console.log('user disconnected');
        chatHistory = [];
    });

    socket.on('ai-message', async (data) => {
        try {
            const { prompt, model } = data;

            // Add user message to history
            chatHistory.push({
                role: "user",
                content: prompt
            });

            let response;

            // Route to the correct AI service based on model selection
            switch (model) {
                case 'gemini':
                    response = await GenerateAIResponse(chatHistory);
                    break;
                case 'groq':
                    response = await GenerateGroqResponse(chatHistory);
                    break;
                case 'sarvam':
                    response = await sarvamAIResponse(chatHistory);
                    break;
                default:
                    response = await GenerateGroqResponse(chatHistory);
                    break;
            }

            // Add assistant reply to history
            chatHistory.push({
                role: "assistant",
                content: response
            });

            socket.emit('ai-response', response);

        } catch (error) {
            console.error('AI Error:', error.message);

            // Send a clean, short error message to the frontend
            const msg = error.message || '';
            let shortMsg = 'Something went wrong. Please try again.';

            if (error.status === 429 || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
                shortMsg = 'Rate limit exceeded. Please wait a moment or switch to a different model.';
            } else if (error.status === 401 || error.status === 403 || msg.includes('API key')) {
                shortMsg = 'Authentication error. Check your API key.';
            } else if (msg.length < 200) {
                shortMsg = msg;
            }

            socket.emit('ai-response', `Error: ${shortMsg}`);
        }
    });
});


httpServer.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});