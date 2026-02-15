const mongoose = require('mongoose')


function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Server is successfully connected to DB!')
    })
    .catch((err)=>{
        console.log('Error while connecting to DB:', err)
    })
}

module.exports = connectToDB;
