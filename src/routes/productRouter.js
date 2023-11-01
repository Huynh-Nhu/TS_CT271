const express = require('express');
const router = express.Router();
const ProductController = require('../app/controllers/ProductController');


// // router.use('/caterogy', ProductController.addCaterogy);
// router.use('/test', ProductController.getId);

// router.use('/search', ProductController.searchProducts)
router.use('/products', ProductController.addProduct);
router.use('/img',ProductController.showImage);
router.use('/home', ProductController.show);
router.use('/:id/edit', ProductController.update);
router.use('/:id/upimg', ProductController.updateImage);
router.delete('/:id', ProductController.deleteProduct);

router.use('/:id', ProductController.getOneProduct);

module.exports = router;