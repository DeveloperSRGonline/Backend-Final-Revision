const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerController(req, res) {
  const { username, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ username });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    password: hashedPassword,
  });

  const generatedToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res.cookie("token", generatedToken);

  res.status(201).json({ message: "User created successfully", user: newUser });
}

async function loginController(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const generatedToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", generatedToken);

  res.status(200).json({ message: "User logged in successfully", user });
}

module.exports = {
  registerController,
  loginController,
};
