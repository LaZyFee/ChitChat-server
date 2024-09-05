const express = require("express");
const router = express.Router();
const { protect } = require("../Middlewares/authenticateToken");
const { allConversations, sendMessage, getMessages } = require("../Controller/conversationController");

// Fetch all conversations related to a specific chat
router.route("/:chatId/conversations").get(protect, allConversations);


// Send a new message in a chat
router.route("/conversations").post(protect, (req, res) => {
    console.log("SendMessage route hit");
    sendMessage(req, res);
});

module.exports = router;
