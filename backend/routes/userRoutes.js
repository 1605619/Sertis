const express = require('express');
const UserController = require('../controllers/UserControllers');

const router = express.Router();
const userController = new UserController();

router.post('/login', userController.login);
router.post('/signup', userController.signup); 

module.exports = router;