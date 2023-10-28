const express = require('express');
const router = express.Router();

const orderController = require('../app/controllers/orderController')

router.use('/update/:id', orderController.update)
router.use('/product/:id', orderController.showProductOrder)
router.use('/show', orderController.showOrder)
router.use('/', orderController.addOrder)


module.exports = router;