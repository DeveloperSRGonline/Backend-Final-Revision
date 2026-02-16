const express = require('express')
const connectToDB = require('./db/db')
const authRoutes = require('./routes/auth.routes')

const app = express()
app.use(express.json())
app.use('/auth',authRoutes)

connectToDB()

module.exports = app;