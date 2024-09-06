const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        chat: {
            type: String,
            ref: "Chat",
        },
        attachments: [
            {
                fileName: {
                    type: String,
                    required: true,
                },
                fileType: {
                    type: String,
                    required: true,
                },
                fileUrl: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);
const Message = mongoose.model("Conversation", messageModel);
module.exports = Message