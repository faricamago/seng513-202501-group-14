// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Allow frontend to communicate with backend
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import and use routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Simple test route
app.get('/', (req, res) => {
  res.send('Backend for UCalgary Community App is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
