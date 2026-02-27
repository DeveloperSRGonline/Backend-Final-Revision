const userModel = require("../models/user.model");
const uploadFile = require("../services/storage.service");
async function getProfile(req,res){
    //get username from params
    const {username} = req.params;

    // find user by username (exclude password)
    const user = await userModel.findOne({username}).select("-password");

    // if not found return 404
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    // return the user profile data
    res.status(200).json({user});
}
async function updateProfile(req,res){
    // get userId from req.user._id
    const userId = req.user._id;
    
    // get username,bio from req.body
    const {username,bio} = req.body;

    // validate data
    if(!username || !bio){
        return res.status(400).json({message:"Username and bio are required"});
    }

    // find user by userId
    const user = await userModel.findById(userId);

    // if not found return 404
    if(!user){
        return res.status(404).json({message:"User not found"});
    }   

    // update user profile
    user.username = username;
    user.bio = bio;
    
    // save updated user
    await user.save();

    // return updated user profile
    res.status(200).json({user});
}
async function uploadAvatar(req,res){
    // get file from req.file
    const file = req.file;

    const userId = req.user._id;

    // get user
    const user = await userModel.findById(userId);

    // upload file to imagekit
    const response = await uploadFile(file.buffer, file.originalname);

    // update user.avatar with new url
    user.avatar = response.url;
    
    // save updated user
    await user.save();
    
    // return success response
    res.status(200).json({user});
}

module.exports = {
    getProfile,
    updateProfile,
    uploadAvatar
}