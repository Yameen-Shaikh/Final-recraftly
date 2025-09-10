const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/upload.controller');
const upload = require('../middleware/multer');

router.post('/', upload.single('image'), uploadController.uploadImage);
router.get('/', uploadController.getUploads);
router.get('/author/:authorName', uploadController.getUploadsByAuthor); // New route
router.get('/:id', uploadController.getImage);

module.exports = router;