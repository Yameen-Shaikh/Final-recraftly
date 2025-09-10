const User = require('../models/user.model');
const Upload = require('../models/upload.model');
const Comment = require('../models/comment.model');
const bcrypt = require('bcryptjs');

// TEMPORARY: Function to create an admin user (REMOVE IN PRODUCTION)
const createAdminUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await User.findOne({ username, role: 'admin' });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Admin user already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password before saving admin:', hashedPassword);
    const adminUser = new User({
      username,
      password: hashedPassword,
      role: 'admin'
    });
    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin user', error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password'); // Exclude admin and password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete user with ID:', id);
    const user = await User.findById(id);

    if (!user) {
      console.log('User not found for ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      console.log('Attempted to delete admin user.');
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await user.deleteOne();
    console.log('User deleted successfully:', id);
    // Optionally, delete all uploads and comments by this user
    await Upload.deleteMany({ author: user.username }); // Assuming author field matches username
    // Note: Deleting comments associated with uploads by this user would require more complex logic

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

const deleteUpload = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Attempting to delete upload with ID:', id);
    const upload = await Upload.findById(id);

    if (!upload) {
      console.log('Upload not found for ID:', id);
      return res.status(404).json({ message: 'Upload not found' });
    }

    await upload.deleteOne();
    console.log('Upload deleted successfully:', id);
    await Comment.deleteMany({ upload: id }); // Delete associated comments

    res.status(200).json({ message: 'Upload deleted successfully' });
  } catch (error) {
    console.error('Error deleting upload:', error);
    res.status(500).json({ message: 'Error deleting upload', error: error.message });
  }
};

module.exports = {
  createAdminUser, // Add the new function to exports
  getAllUsers,
  deleteUser,
  deleteUpload
};