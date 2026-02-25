const mongoose = require("mongoose");



const postSchema = new mongoose.Schema({
    image:String,
    caption:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,// jo bhi user hoga uski id
        ref:"User" // kis collection se belong karta hai ye
    }
})

const postModel = mongoose.model("Post",postSchema)

module.exports = postModel;