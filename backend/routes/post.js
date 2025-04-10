import express from 'express';
import * as postController from '../controllers/postController.js';
import { upload } from '../controllers/upload.js';

const router = express.Router();

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

// Report a post
router.post('/report', postController.reportPost);

export default router;

