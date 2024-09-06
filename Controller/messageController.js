const MessageModel = require("../Models/MessageModel");
const UserModel = require("../Models/UserModel");
const ChatModel = require("../Models/ChatModel");

const allMessages = async (req, res) => {
    try {
        const message = await MessageModel.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("receiver", "name email") // Ensure receiver is a valid reference in the schema
            .populate("chat");

        if (message.length === 0) {
            return res.status(404).json({ message: "No conversations found." });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


const sendMessage = async (req, res) => {
    try {
        const { content, chatId } = req.body;

        // Validate request data
        if (!content || !chatId) {
            return res.status(400).json({ error: "Invalid data passed into request" });
        }

        // Create new message object
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        try {
            // Save the message in the database
            let message = await MessageModel.create(newMessage);

            // Populate related fields
            message = await message.populate("sender", "name");
            message = await message.populate("chat");
            message = await message.populate("receiver");

            // Populate users in the chat
            message = await UserModel.populate(message, {
                path: "chat.users",
                select: "name email",
            });

            // Update the latest message in the chat
            await ChatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            // Send the response with the populated message
            res.status(200).json(message);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { allMessages, sendMessage };