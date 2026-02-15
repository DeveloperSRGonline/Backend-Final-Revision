const express = require('express');
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken')

const router = express.Router()

router.post('/register',async (req,res)=>{
    const {username,password} = req.body;

    const user = await userModel.create({
        username:username,
        password:password
    })

    const generatedToken = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie('token',generatedToken)

    res.status(201).json({
        message:'User registered successfully!',
        user:user.username
    })
}) 


router.post('/login',async (req,res)=>{
    const {username,password} = req.body

    const user = await userModel.findOne({username})

    if(!user){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const isPasswordValid = password == user.password
    
    if(!isPasswordValid){
        return res.status(401).json({
            message:"Invalid credentials"
        })
    }

    const generatedToken = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET)

    res.cookie('token',generatedToken)

    res.status(200).json({
        message:"User logged in successfully!",
        user:user.username
    })
})

router.get('/user',async (req,res)=>{
    const {token} = req.cookies;

    if(!token) {
        return res.status(401).json({
            message:'Unauthorized - No token provided'
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('Decoded token:', decoded)
        console.log('Looking for user with ID:', decoded.id)
         const user = await userModel.findOne({
            _id:decoded.id
         }).select('-password -__v').lean()
         console.log('Found user:', user)

         res.status(200).json({
            message:'user data fetched successfully!',
            user:user
         })
    } catch (error) {
        return res.status(401).json({
            message:"Unauthorized - Invalid token"
        })
    }
})
module.exports = router;