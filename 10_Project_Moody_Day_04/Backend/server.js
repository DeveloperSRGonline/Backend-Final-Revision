require('dotenv').config()
const app = require('./src/app')
const connectToDB = require('./src/db/db')

// first connect to DB
connectToDB()

// then listen to port
app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})