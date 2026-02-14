// require mongoose to create schema and model
const  mongoose = require('mongoose')


// first create schema
const userSchema = new mongoose.Schema({
    username: String,
    password:String
})


// now create model using schema
const userModel = mongoose.model('User',userSchema)


// export model
module.exports = userModel;