const express = require('express');
const   router = express.Router();

const cartController = require('../app/controllers/CartController')

router.use('/show/:id', cartController.delete )
router.use('/show', cartController.showCart)
router.use('/add', cartController.addCart)




module.exports = router;