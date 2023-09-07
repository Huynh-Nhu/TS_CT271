const express = require('express');
const router = express.Router();

//nạp controller
const newsController =require('../app/controllers/NewController');

// newController.index

router.get('/:slug',newsController.show);
router.get('/',newsController.index);

module.exports = router;