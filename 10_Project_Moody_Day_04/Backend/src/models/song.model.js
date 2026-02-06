const mongoose = require('mongoose')

// abhi ke liye sirf hum ye tin chije hi rakhenge 
// title , artist , audio_url
const songSchema = new mongoose.Schema({
    title : String,
    artist : String,
    audio_url : String,
    mood:String
})

// model creation for easy crud operations
const songModel = mongoose.model('Song', songSchema)

module.exports = songModel;