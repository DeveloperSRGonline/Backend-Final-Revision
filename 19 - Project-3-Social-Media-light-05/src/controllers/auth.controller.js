const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const uploadFile = require("../services/storage.service");

async function registerController(req, res) {
  const { username, password, bio, fullName, website, location } = req.body;

  // avatar
  const avatar = req.file;

  // validate data
  if (!avatar) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  // check if user already exists or not
  const isUserAlreadyExists = await userModel.findOne({ username });

  // if user already exists return 409 (conflict)
  if (isUserAlreadyExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // upload avatar to imagekit
  const response = await uploadFile(
    avatar.buffer,
    `${uuidv4()}.${avatar.originalname.split(".").pop()}`,
  );

  // create new user
  const newUser = await userModel.create({
    username,
    password: hashedPassword,
    avatar: response.url,
    bio,
    fullName,
    website,
    location,
  });

  // generate token
  const generatedToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  // set cookie
  res.cookie("token", generatedToken);

  // return response
  res.status(201).json({ message: "User created successfully", user });
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

  // remove password from user object before sending response
  user.password = undefined;

  res.cookie("token", generatedToken);

  res
    .status(200)
    .json({
      message: "User logged in successfully",
      user,
    });
}

module.exports = {
  registerController,
  loginController,
};
