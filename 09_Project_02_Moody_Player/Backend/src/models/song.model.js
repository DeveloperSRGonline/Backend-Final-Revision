const mongoose = require('mongoose')

// abhi ke liye sirf hum ye tin chije hi rakhenge 
// title , artist , audio_url
const songSchema = new mongoose.Schema({
    title : String,
    artist : String,
    audio_url : String
})

// model creation for easy crud operations
const song = mongoose.model('Song', songSchema)

module.exports = song;