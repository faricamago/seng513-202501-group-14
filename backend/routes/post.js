const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../controllers/upload');

// Retrieve all posts
router.get('/', postController.getPosts);

// Create a new post
router.post('/', upload.array('images'), postController.createPost);

// Like a post
router.post('/like', postController.togglePostLike);

// Update a post (edit): use the same upload middleware
router.put('/:id', upload.array('images'), postController.updatePost);

// Delete a post
router.delete('/:id', postController.deletePost);

module.exports = router;
