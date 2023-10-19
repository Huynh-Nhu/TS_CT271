const express = require('express');
const router = express.Router();
const UserController = require('../app/controllers/UserController');

router.use('/listUser', UserController.ListUsers);

module.exports = router;