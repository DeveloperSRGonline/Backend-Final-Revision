require('dotenv').config()
const express = require('express')
const connectToDB = require('./src/db/db');


connectToDB();
const app = express();
app.use(express.json())


app.listen(()=>{
    console.log('Server is running on port 3000')
})