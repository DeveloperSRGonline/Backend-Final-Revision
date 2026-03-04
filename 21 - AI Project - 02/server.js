require('dotenv').config();
const app = require("./src/app");
const {createServer} = require('http')
const {Server} = require('socket.io')
const {sarvamAIResponse} = require('./src/services/ai.service')
    
const httpServer = createServer(app)
const io = new Server(httpServer)

// io server
// socket matlab single user
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect',() => {
        console.log('user disconnected');
    })

    // event listner for "message" event
    socket.on('ai-message',async (data) => {
        // const response = await GenerateGroqResponse(data.prompt )
        const response = await sarvamAIResponse(data.prompt)
        
        socket.emit('ai-response', response);
    })
});


httpServer.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});