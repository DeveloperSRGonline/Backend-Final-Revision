const express = require('express')
const connectToDB = require('./db/db')
const authRoutes = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')


connectToDB()
const app = express()
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)

module.exports = app;