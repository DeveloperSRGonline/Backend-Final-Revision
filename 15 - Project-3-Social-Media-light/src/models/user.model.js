const mongoose = require("mongoose");

// schema validation : Rules how user data should be stored
const userSchema = new mongoose.Schema({
    username:{
        type:String, // username should be string
        unique:true, // all user should have unique username
        required:true // username is required
    },
    password:{
        type:String // password should be string
    }
})

// model creation
const userModel = mongoose.model("User",userSchema)

module.exports = userModel;