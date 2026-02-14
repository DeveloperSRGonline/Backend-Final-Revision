// import mongoose 
const mongoose = require('mongoose')


// connect to database function
function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    // jab bhi database se connect hoga tab ye callback chalega
    .then(() => {
        console.log('Connected to database')
    })
    // & jab database se connect nahi hoga tab ye callback chalega
    .catch((err) => {
        console.log('Error connecting to database', err)
    })
}


// export the function to use it in app.js file
module.exports = connectToDB;
