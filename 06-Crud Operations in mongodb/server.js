require("dotenv").config();
const express = require("express");
const connectToDB = require("./src/db/db");
// model require for database crud operations
const noteModel = require("./src/models/note.model");

connectToDB();
const app = express();
app.use(express.json()); //to read req.body's content

// Now we will perform crud operations
// crud operation with model toh await ka use karna hi padega

// create operation
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  // console.log(title,content)
  // ab data toh ham mil raha hai bas ise database mein write karvana hai uske liye model lagega

  // ye promise return karti hai toh async await ka use karna padega
  await noteModel.create({
    title,
    content,
  });

  res.json({
    message: "Note created successfully",
  });
});

// read operation
app.get("/notes", async (req, res) => {
  // find method database mein jitna bhi data hoga vo lekar aane ka kaam karti hai
  const notes = await noteModel.find();

  res.json({
    message: "Notes fetched successfully",
    notes,
  });
});

// update operation
app.patch("/notes/:id", async (req, res) => {
  // extracting id from params
  const { id } = req.params;
  // extracting title from req.body
  const { title,content } = req.body;

  // find the note and update it
  await noteModel.findByIdAndUpdate(
    {
      _id: id,
    },
    {
      title: title,
      content:content
    },
  );

  // finally sending response
  res.json({
    message:"Note updated successfully"
  })
});

// delete operation
app.delete("/notes/:id", async (req, res) => {
  // extracting id from params
  const { id } = req.params;

  // find that id's note and delete it
  await noteModel.findByIdAndDelete({
    _id: id,
  });

  res.json({
    message: "Note deleted successfully",
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
