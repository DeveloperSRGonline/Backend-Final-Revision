const express = require('express');


const app = express();// server create 

// programming server 
// ki agar /home pe koi request aayegi toh "Welcome to home page"

app.get('/home',(req,res)=>{
    console.log('/home hit')
    res.send('Welcome to home page!')
})

// /about - welcome to about page
app.get('/about',(req,res)=>{
    console.log('/about hit')
    res.send('Welcome to about page!')
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000!')
})