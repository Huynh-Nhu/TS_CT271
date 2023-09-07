const express = require('express');
const router = express.Router();

//nạp controller
const siteController =require('../app/controllers/SiteController');


// router.use('/register',siteController.show);

router.get('/',siteController.home);

module.exports = router;