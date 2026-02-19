const express = require("express");
const router = express.Router();
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

// post /register req.body = {username,password}
router.post("/register", async (req, res) => {
  // extracting username and password from request body {destructing}
  const { username, password } = req.body;

  // checking if user already exist
  const isUserAlreadyExist = await userModel.findOne({
    username,
  });

  // if account exist
  if (isUserAlreadyExist) {
    return res.status(409).json({
      message: "User already exist",
    });
  }

  // if account not exist
  const newUser = await userModel.create({
    username,
    password,
  });

  // creating token
  const userToken = jwt.sign(
    {
      id: newUser._id,
    },
    process.env.JWT_SECRET,
  );

  // setting token in cookie
  res.cookie("token", userToken);

  // sending response
  res.status(201).json({
    message: "User registered successfully",
    user: newUser.username,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({
    username,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const isPasswordValid = user.password === password;

  if(!isPasswordValid){
    return res.status(401).json({
      message: "Invalid password"
    })
  }

  // creating token
  const userToken = jwt.sign({
    id:user._id
  },process.env.JWT_SECRET, {
    expiresIn: "1h",
  })

  res.cookie("token", userToken);

  res.status(200).json({
    message: "User logged in successfully",
    user: user.username
  });
});

router.get("/user", async (req, res) => {
  const token = req.cookies.token;

  // if token not found
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    // verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await userModel.findOne({
      _id: decoded.id,
    });
    res.status(200).json({
      message: "User Data Fetched Successfully",
      user: user.username,
    });
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "User logged out successfully",
  });
});

module.exports = router;
