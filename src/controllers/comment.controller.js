const Comment = require('../models/comment.model');

const addComment = async (req, res) => {
  try {
    const { text, author } = req.body;
    const { uploadId } = req.params;

    const newComment = new Comment({
      text,
      author,
      upload: uploadId
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send('Error adding comment: ' + error.message);
  }
};

const getComments = async (req, res) => {
  try {
    const { uploadId } = req.params;
    const comments = await Comment.find({ upload: uploadId }).sort({ createdAt: 'desc' });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).send('Error fetching comments: ' + error.message);
  }
};

module.exports = {
  addComment,
  getComments
};