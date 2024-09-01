// models/GroupChat.js
const mongoose = require("mongoose");

const groupChatModel = mongoose.Schema({
    chatName: {
        type: String,
        trim: true,
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    isGroupChat: {
        type: Boolean,
        default: true,
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});

const GroupChat = mongoose.model("GroupChat", groupChatModel);

module.exports = GroupChat;
