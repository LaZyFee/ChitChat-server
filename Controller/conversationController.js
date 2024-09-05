const Conversation = require("../Models/Conversation");
const Chat = require("../Models/Chat");
const User = require("../Models/Users");

const allConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("receiver", "name email") // Ensure receiver is a valid reference in the schema
            .populate("chat");

        if (conversations.length === 0) {
            return res.status(404).json({ message: "No conversations found." });
        }

        res.status(200).json(conversations);
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
            let message = await Conversation.create(newMessage);

            // Populate related fields
            message = await message.populate("sender", "name email");
            message = await message.populate("chat");
            message = await message.populate("receiver", "name email"); // Ensure receiver is a valid reference in the schema

            // Populate users in the chat
            message = await User.populate(message, {
                path: "chat.users",
                select: "name email",
            });

            // Update the latest message in the chat
            await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

            // Send the response with the populated message
            res.status(200).json(message);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { allConversations, sendMessage };