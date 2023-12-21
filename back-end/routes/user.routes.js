const Router = require('express');

const router = new Router();

const UserController = require('../controllers/user.controller');

router.get('/categories', UserController.getAllCategories);

router.get('/brands', UserController.getAllBrands);

router.get('/products/filter', UserController.getProductsByFilter);

router.get('/filter/:tableName', UserController.getFilterByCategory);

router.get('/products/:category/:productId', UserController.getProductById);

module.exports = router;