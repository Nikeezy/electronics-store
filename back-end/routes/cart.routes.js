const Router = require('express');

const router = new Router();

const CartController = require('../controllers/cart.controller');

router.post('/add', CartController.addProductToCart);

router.get('/products', CartController.getProductsFromCart);

router.get('/check', CartController.checkProductInCart);

router.get('/remove', CartController.removeProductFromCart);

router.post('/update', CartController.updateProductInCart);

router.post('/purchase', CartController.makePurchase);

module.exports = router;