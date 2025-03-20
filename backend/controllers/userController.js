// controllers/userController.js
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    // Validate that the email ends with @ucalgary.ca
    if (!req.body.email.endsWith('@ucalgary.ca')) {
      return res.status(400).json({ error: 'Email must be a valid UCalgary email address' });
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User login endpoint
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // In production, generate and return an authentication token here.
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
