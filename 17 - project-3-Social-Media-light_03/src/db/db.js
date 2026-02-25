const mongoose = require('mongoose')


function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((err) => {
        console.log('Error connecting to database', err);
    });
}

module.exports = connectToDB;