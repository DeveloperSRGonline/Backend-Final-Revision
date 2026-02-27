const express = require("express");
const { getProfile, updateProfile, uploadAvatar } = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth..middleware");
const multer = require("multer");

const router = express.Router();

router.get('/:username',getProfile)
router.put('/',authMiddleware,updateProfile)
router.post('/avatar',authMiddleware,multer().single('avatar'),uploadAvatar)


module.exports = router;