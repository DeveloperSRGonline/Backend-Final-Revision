const mongoose = require('mongoose')

// server database se kaise connect hoga ye hum db.js file mien likhenge

function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Connected to DB!')
    })
    .catch((err) => {
        console.error('Failed to connect to DB:', err.message)
    })
}

module.exports = connectToDB;