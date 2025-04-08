// routes/post.js
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../controllers/upload');

// Retrieve all posts
router.get('/', postController.getPosts);

// Create a new post
router.post('/', upload.array('images'), postController.createPost);

// Report a post
router.post('/like', postController.togglePostLike);

module.exports = router;
