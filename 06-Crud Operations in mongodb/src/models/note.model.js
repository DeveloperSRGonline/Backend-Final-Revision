const mongoose = require('mongoose');// ye toh pahele bhi require kiye the toh yana kyo 
// har baar jab alag alag file mein use lagaga toh alag alag require karna padega har ek file mein


// schema creation (structure)
const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    }
})

// model creation (crud operation become easy with model)
const noteModel = mongoose.model('Notes',noteSchema)

// exporting model
module.exports = noteModel;