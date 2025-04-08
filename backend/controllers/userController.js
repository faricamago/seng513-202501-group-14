// controllers/userController.js
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

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

// Follow a user
exports.followUser = async (req, res) => {
  try {
    const { follower, following } = req.body;
    if (follower === following) {
      return res.status(400).json({ error: "Cannot follow yourself" });
    }
    // Update the follower's following list and the following user's followers list.
    await User.findOneAndUpdate(
      { username: follower },
      { $addToSet: { following: following } },
      { new: true }
    );
    await User.findOneAndUpdate(
      { username: following },
      { $addToSet: { followers: follower } },
      { new: true }
    );
    res.status(200).json({ message: "Follow successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the list of users that a given user is following
exports.getFollowing = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.following || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unfollow a user
exports.unfollowUser = async (req, res) => {
  console.log("unfollowUser called with body:", req.body);
    try {
      const { follower, following } = req.body;
      if (follower === following) {
        return res.status(400).json({ error: "Cannot unfollow yourself" });
      }
      await User.findOneAndUpdate(
        { username: follower },
        { $pull: { following: following } },
        { new: true }
      );
      await User.findOneAndUpdate(
        { username: following },
        { $pull: { followers: follower } },
        { new: true }
      );
      res.status(200).json({ message: "Unfollow successful" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.uploadProfilePicture = async (req, res) => {
    try {
      const username = req.body.username;
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      
      // Compute the new relative file path for the uploaded file.
      const newFilePath = path.relative(process.cwd(), req.file.path);
      
      // Retrieve the user record to check for an existing profile picture.
      const currentUser = await User.findOne({ username });
      if (currentUser && currentUser.photo) {
        // Compute the absolute path to the old picture using the database value.
        const oldFilePath = path.resolve(process.cwd(), currentUser.photo);
        console.log("Attempting to delete old file at:", oldFilePath);
        
        if (fs.existsSync(oldFilePath)) {
          try {
            await fs.promises.unlink(oldFilePath);
            console.log("Old profile picture deleted successfully.");
          } catch (unlinkError) {
            console.error("Error deleting old file:", unlinkError);
          }
        } else {
          console.log("Old file not found at:", oldFilePath);
        }
      }
  
      // Update the User document with the new profile picture's relative path.
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { photo: newFilePath },
        { new: true }
      );
      
      return res.status(200).json({ 
        message: 'Profile picture updated successfully', 
        photo: updatedUser.photo 
      });
    } catch (err) {
      console.error("Error in uploadProfilePicture:", err);
      return res.status(500).json({ error: err.message });
    }
  };

// Get user profile by username
exports.getUserProfile = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Return user data; optionally remove sensitive fields like password.
    const { password, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
