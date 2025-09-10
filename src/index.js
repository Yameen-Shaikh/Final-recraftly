require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/upload.route');
const commentRoutes = require('./routes/comment.route');
const adminRoutes = require('./routes/admin.route');
const userRoutes = require('./routes/user.route');
const authController = require('./controllers/auth.controller');
const User = require('./models/user.model'); // For temporary admin creation

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.post('/api/admin/login', authController.adminLogin);

app.get('/', (req, res) => {
  res.send('Hello from ReCraftly Backend!');
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/upload', uploadRoutes);
app.use('/comments', commentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});