const Upload = require('../models/upload.model');

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const newUpload = new Upload({
      description: req.body.description,
      data: req.file.buffer,
      contentType: req.file.mimetype,
      author: req.body.author || 'Anonymous' // Save author
    });

    await newUpload.save();
    res.status(201).send('File uploaded and data saved successfully.');
  } catch (error) {
    res.status(500).send('Error saving data: ' + error.message);
  }
};

const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: 'desc' });
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).send('Error fetching data: ' + error.message);
  }
};

const getUploadsByAuthor = async (req, res) => {
  try {
    const { authorName } = req.params;
    const uploads = await Upload.find({ author: authorName }).sort({ createdAt: 'desc' });
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).send('Error fetching uploads by author: ' + error.message);
  }
};

const getImage = async (req, res) => {
    try {
        const upload = await Upload.findById(req.params.id);
        if (!upload || !upload.data) {
            return res.status(404).send('Image not found.');
        }
        res.set('Content-Type', upload.contentType);
        res.send(upload.data);
    } catch (error) {
        res.status(500).send('Error fetching image: ' + error.message);
    }
};

module.exports = {
  uploadImage,
  getUploads,
  getUploadsByAuthor,
  getImage
};