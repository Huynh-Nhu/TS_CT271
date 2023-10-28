const express = require('express');
const router = express.Router();

//nạp controller
const registerController =require('../app/controllers/RegisterController');

router.use('/create',registerController.create); 





// router.use('/',registerController.createon); 



module.exports = router;