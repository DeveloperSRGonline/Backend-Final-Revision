// first express require
const express = require('express')
// import connect to database function
const connectToDB = require('./db/db')
// import auth routes
const authRoutes = require('./routes/auth.routes')

// & call it to connect to database
connectToDB();

// create server instance
const app = express()
// use express.json() middleware to parse data to req.body
app.use(express.json())
// use authRoutes
app.use('/auth',authRoutes)



// export app to user it in server.js file
module.exports = app;