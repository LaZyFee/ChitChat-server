const express = require("express");
const router = express.Router();

const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const { protect } = require("../Middlewares/authenticateToken");
const { allUsers } = require("../Controller/userController");
const { updateUserDetails } = require("../Controller/updateUser");

// Routes for signup and login
router.post("/signup", signupController.signUp);
router.post("/login", loginController.login);

// Protected route for fetching all users
router.get("/users", protect, allUsers);

// Protected route for updating user details
router.put("/update", protect, updateUserDetails);

// Logout route
router.post("/logout", protect, loginController.logout);


module.exports = router;
