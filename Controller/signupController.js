const UserModel = require("../Models/UserModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
    try {
        const { name, email, mobile, password, image } = req.body;

        // Server-side validation
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email or name already exists
        const existingUser = await UserModel.findOne({ $or: [{ email }, { name }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email is already taken" });
            }
            if (existingUser.name === name) {
                return res.status(400).json({ message: "Name is already taken" });
            }
        }

        // Check if image is provided and validate its format
        if (image) {
            const contentType = image.split(";")[0].split(":")[1];
            if (!['image/png', 'image/jpeg', 'image/webp'].includes(contentType)) {
                return res.status(400).json({ message: "Unsupported image format" });
            }
        }

        // Generate salt and hash the password with salt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Prepare the user object
        const user = new UserModel({
            name,
            email,
            mobile,
            password: hashedPassword,
            profilePicture: image
                ? {
                    data: Buffer.from(image.split(",")[1], 'base64'),  // Extract base64 data
                    contentType: image.split(";")[0].split(":")[1],    // Dynamically extract content type
                }
                : undefined,
        });

        // Save user to database
        await user.save();

        // Create JWT
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30d' }
        );

        // Respond with success message and token
        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                name: user.name,
                profilePicture: user.profilePicture
                    ? `data:${user.profilePicture.contentType};base64,${user.profilePicture.data.toString('base64')}`
                    : null,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    signUp,
};
