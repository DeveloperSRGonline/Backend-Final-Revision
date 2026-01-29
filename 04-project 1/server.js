const express = require("express");

const app = express(); // server create
app.use(express.json()); // middleware to read req.body data 
// without this middleware  we will get undefined when read req.body\

let notes = [];
// lekin ek dikkat hai ki jab hum kuch changes karte hai code mein server restart hota hai and array phir se empty ho jata hai
// kyo ki variable "RAM" mein store hote hai

// server program
// app.get("/", (req, res) => {
//   console.log("Welcome!");
//   res.send("Welcome Shivam!");
// });

// /notes => {title,content} // frontend se aayege is api par method hogi "POST"

// 01. create note
// to send data from frontend to backend
app.post("/notes", (req, res) => {
  notes.push(req.body);
  res.json({
    message:`Note " ${req.body.title} " Created Successfully!`
  })
});

// 02. get all notes
// to get data back from backend to frontend
app.get('/notes',(req,res)=>{
    res.json({"All Notes":notes}) 
})

// 03. updating existing data present on server
// PATCH - /notes/:index => {title}
app.patch('/notes/:index',(req,res)=>{
    // params se index nikale
    const index = req.params.index;

    // req.body se title destructure karke nikale
    const {title} = req.body;

    // jis bhi index ka title change karna hai uske title ko new title se replace kar diye
    notes[index].title = title;

    // finally response send
    res.json({
        message:'Note updated successfully!',
        "Updated Note":notes[index]
    })
})

// 04. delete karna ho backend se data tab DELETE method
app.delete('/notes/:index',(req,res)=>{
    const index = req.params.index;

    delete notes[index]

    res.json({
        message:"Note deleted successfully!"
    })
})


app.listen(3000, () => {
  // server start
  console.log("Server is running on port 3000!");
});
