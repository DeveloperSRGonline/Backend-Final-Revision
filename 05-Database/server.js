require('dotenv').config()
const express = require('express')
// importing connection code from db.js
const connectToDB = require('./src/db/db')

// calling connect to db function
connectToDB()
const app = express()
app.use(express.json())



app.get('/',(req,res)=>{
    res.send('Hello world');
})
// create note
app.post('/notes',(req,res)=>{
    const {title,content} = req.body;
    console.log(title,content)
})


app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})