const postModel = require("../models/post.model");
const { generateCaption } = require("../services/ai.service");


async function createPostController(req,res){
    const file = req.file;
    // console.log('file received', file);

    const base64Image = new Buffer.from(file.buffer).toString('base64');
    // console.log('base64Image', base64Image);

    const Caption = await generateCaption(base64Image);
    // console.log('Caption', Caption);
    
    res.json({
        Caption
    });
}

module.exports = {
    createPostController
};
