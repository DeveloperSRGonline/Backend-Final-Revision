const express = require('express')
const router = express.Router();
const {registerController, loginController} = require('../controllers/auth.controller');

/*
In this file only routes controllers in different files
*/

router.post('/register',registerController)
router.post('/login',loginController)

module.exports = router
