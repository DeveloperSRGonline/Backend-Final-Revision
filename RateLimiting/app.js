const express = require('express')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
    windowMs:1 * 60 * 1000,
    max:5,
    message:'Too many requests from this IP, please try again later after a minute.'
})

const app = express();

app.post('/api/auth/register',limiter,(req,res)=>{
    res.status(201).json({message: 'User registered successfully'});
});

module.exports = app;