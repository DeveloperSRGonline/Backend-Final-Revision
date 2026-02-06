const mongoose = require('mongoose')

function connectTODB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Server is successfully connected to DB!')
    })
    .catch((err)=>{
        console.log(err)
    })
}

module.exports = connectTODB;