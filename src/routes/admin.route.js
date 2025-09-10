const express = require('express');
const router = express.Router();
const { protect, authorizeAdmin } = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

// TEMPORARY: Route to create an admin user (REMOVE IN PRODUCTION)
router.post('/create-admin', adminController.createAdminUser);

// All other admin routes will be protected and only accessible by admins
router.use(protect, authorizeAdmin);

router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/uploads/:id', adminController.deleteUpload);

module.exports = router;