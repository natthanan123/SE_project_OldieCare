const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const multer = require('multer');

// Routes
const postRoutes = require('./routes/Post');
const getRoutes = require('./routes/Get');
const putRoutes = require('./routes/Put');
const deleteRoutes = require('./routes/Delete');
const authRoutes = require('./Login/Auth');
const resetPasswordRoute = require('./Login/resetPassword');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully'); 
  })
  .catch((err) => console.error("MongoDB connection error:", err));
  

// ==================== ROUTES ====================
app.use(postRoutes);
app.use(getRoutes);
app.use(putRoutes);
app.use(deleteRoutes);
app.use(authRoutes);
app.use(resetPasswordRoute);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Test route
app.get('/', (req, res) => {
  res.send('hello world');
});


app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message.includes('Only image')) {
    return res.status(400).json({ error: err.message });
  }

  console.error(err);
  res.status(500).json({ error: 'Server error' });
});




// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
