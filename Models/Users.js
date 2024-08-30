const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userModel = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            data: Buffer,
            contentType: String,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);
// Method to compare passwords
userModel.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
const User = mongoose.model("User", userModel);

module.exports = User;