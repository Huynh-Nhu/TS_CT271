const express = require('express');
const router = express.Router();

//nạp controller
const registerController =require('../app/controllers/RegisterController');


router.get('/',registerController.registerUser);

router.post('/',registerController.registerUser);

module.exports = router;