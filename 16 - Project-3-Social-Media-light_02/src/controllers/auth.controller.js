const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerController(req, res) {
  const { username, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ username });

  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await userModel.create({
    username,
    password: await bcrypt.hash(password, 10),
  });

  const generatedToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res.cookie("token", generatedToken);

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser });
}

async function loginController(req, res) {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password,user.password)

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const generatedToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", generatedToken);

  return res.status(200).json({ message: "User logged in successfully", user });
}

module.exports = {
  registerController,
  loginController,
};
