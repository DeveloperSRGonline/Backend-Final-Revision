const express = require('express')
const multer = require('multer')
const uploadFile = require('../service/storage.service')
const router = express.Router()
const songModel = require('../models/song.model')

/*
title
artist
song
*/
// is ka matlab kya hai form data mein jis bhi formate mein data aa raha hai us formate mein hum data ko read kar sake isk liye
// hum kya bolte hai jo file aa rahi hai use memoryStorage mein store kar do 
// ab memory storage kya hai - primary storage - RAM
const upload = multer({storage:multer.memoryStorage()})

// isko express by default use kar hi nahi sakta 
// iske liye hum router ok app.js file mein import karke app.use karenge
router.post('/songs',upload.single('audio'),async(req,res)=>{
    console.log(req.body)
    console.log(req.file)
    const fileData = await uploadFile(req.file)
    console.log(fileData)
    res.json({
        message:"Song uploaded successfully",
        song:req.body,
        fileData:fileData.url
    })
})


module.exports = router;