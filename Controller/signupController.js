const User = require("../Models/Users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function signUp(req, res) {
    try {
        const { name, email, mobile, password, image } = req.body;

        // Server-side validation
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email or name already exists
        const existingUser = await User.findOne({ $or: [{ email }, { name }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email is already taken" });
            }
            if (existingUser.name === name) {
                return res.status(400).json({ message: "Name is already taken" });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 6);

        // Prepare the user object
        const user = new User({
            name,
            email,
            mobile,
            password: hashedPassword,
            profilePicture: image
                ? {
                    data: Buffer.from(image.split(",")[1], 'base64'),  // Remove base64 header
                    contentType: 'image/png', // Adjust based on image type
                }
                : undefined, // Set profilePicture only if image is provided
        });

        // Save user to database
        await user.save();

        // Create JWT
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' }
        );

        // Respond with success message and token
        res.status(201).json({
            message: "User created successfully",
            token
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    signUp,
};
