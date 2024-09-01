const express = require("express");
const { protect } = require("../Middlewares/authenticateToken");
const router = express.Router();

const {
    accessChat,
    fetchChats,
    createGroupChat,
    fetchGroupChats,
    groupExit,
    groupAdd,
    addSelfToGroup,
} = require("../Controller/chatController");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/createGroup").post(protect, createGroupChat);
router.route("/fetchGroup").get(protect, fetchGroupChats);
router.route("/groupAdd").put(protect, groupAdd);
router.route("/groupExit").put(protect, groupExit);
router.route("/addSelfToGroup").put(protect, addSelfToGroup);

module.exports = router;
