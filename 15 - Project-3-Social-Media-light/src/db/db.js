const mongoose = require("mongoose");

function connectToDB(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("DB connected to server successfully")
    } catch (error) {
        console.log("Mongoose connection error",error)
    }
}

module.exports = connectToDB;