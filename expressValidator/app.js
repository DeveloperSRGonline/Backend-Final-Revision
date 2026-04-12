const express = require("express");
const validator = require("./middleware/validator.middleware");

const app = express();
app.use(express.json());

app.post("/register", validator.registerValidationRules, (req, res) => {
  const { username, email, password } = req.body;

  res.status(201).json({
    message: "User registered successfully",
    user: {
      username,
      email,
    },
  });
});

module.exports = app;
