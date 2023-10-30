const express = require('express');
const router = express.Router();


const ConnectController = require('../app/controllers/ConnectController')


router.use('/show', ConnectController.showConnect)
router.use('/comment', ConnectController.createConnect)

module.exports = router;