const express = require('express')
const songRoutes = require('./routes/song.routes')
const cors = require('cors')


const app = express() // server ka instance
app.use(cors())
app.use(express.json()) // to read req.body data

// using router
app.use('/',songRoutes) // yaha hum bol raha hei ki hum na api kahi aur banaya hai usne songRoutes se use kar lo server bhai

module.exports = app;