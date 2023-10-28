const express = require('express');
const   router = express.Router();

const categoryController = require('../app/controllers/CaterogyController')
// const ProductController = require('../app/controllers/ProductController');



router.use('/listCate',categoryController.show); 
router.use('/create',categoryController.create); 
router.use('/:id/products',categoryController.addProduct); 
router.use('/:id',categoryController.getId); 




module.exports = router;