const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

router.post('/register', userController.register);
router.post('/test-login', (req, res) => { console.log('Test login route hit!'); res.send('Test login successful!'); });
router.post('/login', userController.login);
router.get('/profile', protect, userController.getProfile);

module.exports = router;
