// require express
const express = require("express");
// require user model for user related CRUD operations
const User = require("../model/user.model");

// create router instance
const router = express.Router();

router.post("/register", async (req, res) => {
  // hamein username aur password frontend se req.body mein milenge
  const { username, password } = req.body;

  // user create karenge
  const user = await User.create({
    username,
    password,
  });

  // jaise hi user create ho jayega to hum usko response mein bhej denge
  return res.status(201).json({
    message: "User created successfully",
    user: user.username,
  });
});

router.post("/login", async (req, res) => {
  // sabse pahele req.body se username aur password nikalenge
  const { username, password } = req.body;

  // jo username and password user ne diya hai kya usse koi user exist karta hai ya nahi
  const user = await User.findOne({ username });

  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isPasswordValid = password === user.password;

  if (!isPasswordValid)
    return res.status(401).json({ message: "Invalid credentials" });

  return res.status(200).json({ message: "Login successful" });
});

// export router and use it in app.js file
module.exports = router;
