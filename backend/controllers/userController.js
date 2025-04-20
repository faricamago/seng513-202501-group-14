// controllers/userController.js

import { uploadImage } from './upload.js';
import User from '../models/User.js';
import { getStoragePathFromUrl, deleteFileFromFirebase } from "../firebaseStorageHelper.js";
import bcryptjs from 'bcryptjs';

// controllers/userController.js
export const registerUser = async (req, res) => {
  try {
    // Validate the email
    if (!req.body.email.endsWith('@ucalgary.ca')) {
      return res.status(400).json({ error: 'Email must be a valid UCalgary email address' });
    }
    // Ensure the bio is never empty by setting default text if not provided or blank
    if (!req.body.bio || req.body.bio.trim() === "") {
      req.body.bio = "This is my bio. Edit to update your profile.";
    }
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User login endpoint
export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Use bcrypt.compare to check if the entered password matches the hashed password
    const isMatch = await bcryptjs.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // In production, generate and return an authentication token here.
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow a user
export const followUser = async (req, res) => {
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
export const getFollowing = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.following || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the list of users that a given user is following
export const getFollowers = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user.followers || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
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

  export const uploadProfilePicture = async (req, res) => {
    try {
      const username = req.body.username;
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
  
      // Find current user to get the old photo URL.
      const currentUser = await User.findOne({ username });
      const oldPhotoUrl = currentUser ? currentUser.photo : null;
  
      // Upload the new profile picture to Firebase Storage.
      const fileUrl = await uploadImage(req.file);
      if (!fileUrl) {
        return res.status(500).json({ error: "Failed to upload file." });
      }
  
      // If there is an old photo and it's a Firebase URL different from the new one, delete the old file.
      if (
        oldPhotoUrl &&
        oldPhotoUrl.startsWith("https://") &&
        oldPhotoUrl !== fileUrl
      ) {
        const storagePath = getStoragePathFromUrl(oldPhotoUrl);
        if (storagePath) {
          await deleteFileFromFirebase(storagePath);
        }
      }
  
      // Update the user's document with the new photo URL.
      const updatedUser = await User.findOneAndUpdate(
        { username },
        { photo: fileUrl },
        { new: true }
      );
  
      return res.status(200).json({
        message: "Profile picture updated successfully",
        photo: updatedUser.photo,
      });
    } catch (err) {
      console.error("Error in uploadProfilePicture:", err);
      return res.status(500).json({ error: err.message });
    }
  };

// Get user profile by username
export const getUserProfile = async (req, res) => {
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


export const updateBio = async (req, res) => {
  try {
    const { username, bio } = req.body;
    if (!bio || bio.trim() === "") {
      return res.status(400).json({ error: "Bio cannot be empty" });
    }
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { bio },
      { new: true }
    );
    res.status(200).json({ message: "Bio updated successfully", bio: updatedUser.bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('username');
    const usernames = admins.map(admin => admin.username);
    res.status(200).json(usernames);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
