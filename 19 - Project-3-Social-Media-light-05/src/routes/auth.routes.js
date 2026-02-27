const express = require('express');
const { registerController, loginController } = require('../controllers/auth.controller');
const multer = require('multer');

const router = express.Router();

router.post('/register',multer().single('avatar'),registerController);
router.post('/login',loginController);


module.exports = router;