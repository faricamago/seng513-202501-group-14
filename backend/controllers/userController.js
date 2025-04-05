// controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Register a new user
exports.registerUser = async (req, res) => {
  try {
    // Validate that the email ends with @ucalgary.ca
    if (!req.body.email.endsWith('@ucalgary.ca')) {
      return res.status(400).json({ error: 'Email must be a valid UCalgary email address' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // 
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    }
    );
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
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Optionally: exclude password from the response
    const { password, ...userData } = user.toObject();

    res.status(200).json({ message: 'Login successful', user: userData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
