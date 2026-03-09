const express = require("express");
const authUser = require("../middleware/auth.middleware");
const { createChat } = require("../controllers/chat.controllers");

const router = express.Router();

router.post("/", authUser, createChat);

module.exports = router;
