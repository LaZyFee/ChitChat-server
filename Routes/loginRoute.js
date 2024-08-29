const express = require("express");
const router = express.Router();




const { login } = require("../Controller/loginController");

router.post("/", login);


module.exports = router;