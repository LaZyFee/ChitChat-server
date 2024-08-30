const express = require("express");
const router = express.Router();
const User = require("../Models/User");



const signupController = require("../Controller/signupController");
const loginController = require("../Controller/loginController");
const logoutController = require("../Controller/logoutController");




router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/logout", logoutController);








module.exports = router