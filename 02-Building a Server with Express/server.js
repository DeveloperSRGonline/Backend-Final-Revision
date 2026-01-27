// npm i cat-me - package
// http - module (by default install)
// const http = require('http');

//server create 
// const server = http.createServer(); // normal no request eccept and response send
// const server = http.createServer((req,res)=>{
//     res.end("Hello World!")
// })

// server start
// server.listen(3000,()=>{
//     console.log('Server is running on port 3000')
// })


// using express 
const express = require('express')

// const app = express();// sirf ye like toh "cannot /GET" 
// lekin http ke time pe toh aisa nahi aata tha

const app = express();
app.get('/home',(req,res)=>{
    res.send('Welcome to the Home Page')
})
// /home pe user jab bhi request karega vaise hi tum welcome to home page 

// req - request object (client ne jo bhi request kiya hoga vo pura data req mein rahega)
// req.body
// req.query
// req.params
// req.headers & req.cookies



// res - response object (use to send data back to client)

app.get('/about',(req,res)=>{
    res.send("Welcome to about page")
})
// /about pe use jab bhi request karega vaise hi tum welcome to about page

app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})