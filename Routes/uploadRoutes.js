const express = require("express");
const multer = require("multer");
const path = require("path");
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
router.post('/upload', upload.array('files'), async (req, res) => {
    const { chatId, senderId, content } = req.body;
    const files = req.files;

    if (files && files.length > 0) {
        try {
            const attachments = files.map(file => ({
                fileName: file.filename,
                fileType: file.mimetype,
                fileUrl: `/uploads/${file.filename}`,
            }));

            const newMessage = new Message({
                sender: senderId,
                chat: chatId,
                content: content || '', // Optional content
                attachments: attachments,
            });

            await newMessage.save();

            res.status(200).json({
                success: true,
                message: 'Files uploaded and message saved',
                attachments,
            });
        } catch (error) {
            res.status(500).send({ error: error.message });
        }
    } else {
        res.status(400).send("No files uploaded.");
    }
});

module.exports = router;
