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
    const fileData = await uploadFile(req.file)
    const song = await songModel.create({
        title:req.body.title,
        artist:req.body.artist,
        audio_url:fileData.url,
        mood:req.body.mood
    })
    res.json({
        message:"Song uploaded successfully",
        song:song
    })
})

router.get('/songs',async(req,res)=>{
    const  {mood} = req.query;

    const requestedSongs = await songModel.find({
        mood:mood
    })

    // status code 200 for - success
    res.status(200).json({
        message:"Songs fetched successfully!",
        songs:requestedSongs
    })
})


module.exports = router;