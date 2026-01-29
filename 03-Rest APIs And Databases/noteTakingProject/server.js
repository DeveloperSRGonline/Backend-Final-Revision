const express = require("express");

const app = express();
app.use(express.json()); // req.body mein data chahiye toh ye middleware use karoge

// notes taking app

// /notes

// data : title & description

let notes = []; // notes empty array pahele

// create task
app.post("/notes", (req, res) => {
  console.log(req.body);// ye ek object rahega req.body mein
  notes.push(req.body);
  // finally hum share karenge kitne notes create ho gaye
  res.json({
    message:"Notes added successfully.",
    notes
  })
});
// get all tasks
// update task
// delete task

app.listen(3000, () => {
  console.log("Server is runnint on port 3000!");
});
