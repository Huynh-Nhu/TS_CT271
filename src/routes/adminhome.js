const express = require('express');
const router = express.Router();

//nạp controller
const homeController =require('../app/controllers/HomeController');
router.use('/home',homeController.addhome);
router.use('/',homeController.home);

module.exports = router;