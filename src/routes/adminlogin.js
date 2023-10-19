const express = require('express');
const router = express.Router();

//nạp controller
const loginController =require('../app/controllers/LoginController');


router.use('/access',loginController.login);

module.exports = router;