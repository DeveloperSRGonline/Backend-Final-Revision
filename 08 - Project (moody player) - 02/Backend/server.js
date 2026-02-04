require('dotenv').config()
const app = require('./src/app')

// db connection file require
const connectTODB = require('./src/db/db')
// and call it
connectTODB()

app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
}) 