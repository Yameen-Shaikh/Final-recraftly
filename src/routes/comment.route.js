const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router.post('/:uploadId', commentController.addComment);
router.get('/:uploadId', commentController.getComments);

module.exports = router;