const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    bio:String,
    avatar:String,
    fullName:String,
    website:String,
    location:String,
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;