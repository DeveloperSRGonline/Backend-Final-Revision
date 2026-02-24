const mongoose = require("mongoose");

function connectToDB(){
    try {
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database", error);
    }
}

module.exports = connectToDB;