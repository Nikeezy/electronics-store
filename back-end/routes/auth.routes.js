const Router = require('express');

const router = new Router();

const AuthController = require('../controllers/auth.controller');

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/logout', AuthController.logout);

module.exports = router;