const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  // destructuring request body
  const {
    fullName: { firstName, lastName },
    email,
    password,
  } = req.body;

  // check if user already exists
  const isUserAlreadyExists = await userModel.findOne({ email });

  // if user already exists, return error
  if (isUserAlreadyExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  // need to encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = await userModel.create({
    fullName: {
      firstName,
      lastName,
    },
    email,
    password: hashedPassword,
  });

  // token creation for authentication
  const generatedToken = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
 
  // setting cookie in res
  res.cookie('token',generatedToken)

  // return success response
  return res
    .status(201)
    .json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
}

async function loginUser(req,res){
    // destructing request body
    const {email,password} = req.body;

    // check if user exists
    const user = await userModel.findOne({ email });

    // if user does not exist, return error
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // if password is incorrect, return error
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    // generate token
    const generatedToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // set cookie
    res.cookie('token', generatedToken);

    // return success response
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
    });
}

module.exports = {
  registerUser,
  loginUser,
};

