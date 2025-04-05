// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// User login endpoint
router.post('/login', userController.loginUser);

// Follow a user
router.post('/follow', userController.followUser);

// Get following list for a user (pass ?username=<username>)
router.get('/following', userController.getFollowing);

// Unfollow a user
router.post('/unfollow', userController.unfollowUser);

module.exports = router;
