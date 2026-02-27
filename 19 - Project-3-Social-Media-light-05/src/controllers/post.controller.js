const postModel = require("../models/post.model");
const { generateCaption } = require("../services/ai.service");
const uploadFile = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");

async function createPostController(req, res) {
  const file = req.file;

  const base64Image = Buffer.from(file.buffer).toString("base64");
  // console.log('base64Image', base64Image);

  const Caption = await generateCaption(base64Image);
  // console.log('Caption', Caption);

  const response = await uploadFile(
    file.buffer,
    `${uuidv4()}.${file.originalname.split(".").pop()}`,
  );
  // console.log('response', response);

  const post = await postModel.create({
    caption:Caption,
    image:response.url,
    user:req.user._id
  })

  res.status(201).json({
    message:"Post created successfully",
    post
  })
}

module.exports = {
  createPostController,
};
