// routes/user.js

import express from 'express';
import * as userController from '../controllers/userController.js';
import { upload } from '../controllers/upload.js';

const router = express.Router();

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

router.post('/uploadProfilePicture', upload.single('profilePic'), userController.uploadProfilePicture);

router.get('/profile', userController.getUserProfile);

router.put('/updateBio', userController.updateBio);


export default router;
