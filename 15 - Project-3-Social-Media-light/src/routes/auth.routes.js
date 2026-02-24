const express = require("express");
const userModel = require("../models/user.model");

const router = express.Router();

/*
POST /register
POST /login
GET /user [protected]
*/

router.post('/register',async(req,res)=>{
    const {username,password} = req.body;
    // console.log(username,password)

    // check user exist or not
    const user = await userModel.findOne({username})

    if(user){
        return res.status(409).json({message:"User already exists"})
    }

    const newUser = await userModel.create({username,password})
    
    const generatedToken = jwt.sign({username},process.env.JWT_SECRET)

    res.cookie("token",generatedToken)

    res.status(201).json({
        message:"User registered successfully",
        user:newUser.username
    })
})

module.exports = router;