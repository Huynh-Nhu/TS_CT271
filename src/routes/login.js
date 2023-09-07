const express = require('express');
const router = express.Router();

//nạp controller
const loginController =require('../app/controllers/LoginController');



router.get('/',loginController.login);

module.exports = router;