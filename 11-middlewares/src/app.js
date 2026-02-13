const express = require('express')
const appRoutes = require('./routes/app.route')


// server instance
const app = express()

// middleware in between app and route
app.use((req,res,next)=>{
    console.log('This is middleware is between app and route')
    next()// this is mandatory
})

app.use('/',appRoutes)

// export app from app.js to server.js
module.exports = app;