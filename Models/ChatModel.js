const mongoose = require("mongoose");

const chatModel = mongoose.Schema({

    content: {
        type: String,
        default: "",
        trim: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    videoUrl: {
        type: String,
        default: ""
    },
    audioUrl: {
        type: String,
        default: ""
    },
    pdfUrl: {
        type: String,
        default: ""
    },
    fileType: {
        type: String,
        default: ""
    },
},
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;