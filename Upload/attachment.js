const express = require("express");
const multer = require("multer");
const path = require("path");
const Message = require("./models/Message"); // Adjust path as needed
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const upload = multer({ storage: storage });

// Express route for file upload and saving to MongoDB
router.post('/upload', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { chatId, senderId, content } = req.body;

    if (file) {
        try {
            // Create a new message with attachment
            const newMessage = new Message({
                sender: senderId,
                chat: chatId,
                content: content || '', // Optional content
                attachments: [{
                    fileName: file.filename,
                    fileType: file.mimetype,
                    fileUrl: `/uploads/${file.filename}`,
                }],
            });

            await newMessage.save();

            res.status(200).json({
                success: true,
                message: 'File uploaded and message saved',
                fileInfo: {
                    fileName: file.filename,
                    fileUrl: `/uploads/${file.filename}`,
                    fileType: file.mimetype,
                },
            });
        } catch (error) {
            res.status(500).send(error.message);
        }
    } else {
        res.status(400).send("No file uploaded.");
    }
});

module.exports = router;
