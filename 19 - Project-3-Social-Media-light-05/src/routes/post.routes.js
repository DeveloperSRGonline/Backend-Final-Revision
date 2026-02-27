const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth..middleware");
const multer = require("multer");
const {createPostController} = require("../controllers/post.controller");

const uppload = multer({storage:multer.memoryStorage()})


// POST /api/posts [protected] {image-file}
router.post('/',authMiddleware, uppload.single('image'), createPostController)
 
module.exports = router;
