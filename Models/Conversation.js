const mongoose = require("mongoose");

const conversationModel = mongoose.Schema(
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
            trim: true,
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
const Conversation = mongoose.model("Conversation", conversationModel);
module.exports = Conversation