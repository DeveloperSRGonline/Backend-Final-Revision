require('dotenv').config()
const express = require('express')
const app = require('./src/app')

const PORT = 8000

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the server!' })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})