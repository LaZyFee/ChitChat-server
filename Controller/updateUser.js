import UserModel from "../Models/UserModel";

export const updateUserDetails = async (req, res) => {
    try {
        const { name, profile_pic } = req.body;

        // Updating the user in the database
        const updateUser = await UserModel.updateOne(
            { _id: req.user._id }, // Query to find the user
            {
                name,
                profile_pic
            } // The fields to update
        );

        if (updateUser.modifiedCount > 0) {
            return res.status(200).json({
                message: "updated successfully"
            });
        } else {
            return res.status(400).json({
                message: "something went wrong"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};
