// env configuration
require('dotenv').config()
// import app from src/app.js
const app = require('./src/app')


// start the server
app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})