const express = require("express");
const router = express.Router();

const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const { protect } = require("../Middlewares/authenticateToken");
const { allUsers } = require("../Controller/userController");

// Routes for signup and login
router.post("/signup", signupController.signUp);
router.post("/login", loginController.login);

// Protected route for fetching all users
router.get("/users", protect, allUsers);

// Logout route
router.post("/logout", protect, loginController.logout);

module.exports = router;
