// routes/user.js

import express from 'express';
import * as userController from '../controllers/userController.js';
import { upload } from '../controllers/upload.js';

const router = express.Router();


router.post('/register', userController.registerUser);


router.post('/login', userController.loginUser);


router.post('/follow', userController.followUser);

router.get('/following', userController.getFollowing);

router.get('/followers', userController.getFollowers);

router.get('/admins', userController.getAdmins);

router.post('/unfollow', userController.unfollowUser);

router.post('/uploadProfilePicture', upload.single('profilePic'), userController.uploadProfilePicture);

router.get('/profile', userController.getUserProfile);

router.put('/updateBio', userController.updateBio);


export default router;
