const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authenticateToken");
const { allMessagesForAllUsers, allMessages, sendMessage } = require("../Controller/messageController");

// Fetch all messages for all users
router.route("/all").get(protect, allMessagesForAllUsers);

// Fetch all messages related to a specific chat
router.route("/:chatId").get(protect, allMessages);

// Send a new message in a chat
router.route("/").post(protect, sendMessage);

module.exports = router;
