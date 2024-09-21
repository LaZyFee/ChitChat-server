const UserModel = require('../Models/UserModel');
const bcrypt = require('bcrypt');

const updateUserDetails = async (req, res) => {
    try {
        const { name, currentPassword, newPassword } = req.body;
        let updateFields = { name };

        // Fetch the user from the database
        const user = await UserModel.findById(req.user._id);

        // Check if the current password matches
        if (currentPassword && newPassword) {
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);

            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Incorrect current password.' });
            }

            // Hash the new password and add it to the update fields
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateFields.password = hashedPassword;
        }

        // Check if profile picture is being uploaded
        if (req.file) {
            updateFields.profilePicture = {
                data: req.file.buffer, // Store the file as a buffer
                contentType: req.file.mimetype, // Store the MIME type
            };
        }

        // Update the user details in the database
        const updateUser = await UserModel.updateOne(
            { _id: req.user._id }, // Query by user ID
            updateFields // The fields to update
        );

        if (updateUser.modifiedCount > 0) {
            const updatedUser = await UserModel.findById(req.user._id).select('-password');
            return res.status(200).json({
                message: 'Profile updated successfully.',
                user: updatedUser, // Send back the updated user data
            });
        } else {
            return res.status(400).json({
                message: 'Failed to update profile.',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    updateUserDetails,
};
