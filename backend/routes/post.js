import express from 'express';
import * as postController from '../controllers/postController.js';
import * as commentController from '../controllers/commentController.js';
import { upload } from '../controllers/upload.js';

const router = express.Router();


router.get('/', postController.getPosts);


router.post('/', upload.array('images'), postController.createPost);


router.post('/like', postController.togglePostLike);


router.put('/:id', upload.array('images'), postController.updatePost);


router.delete('/:id', postController.deletePost);


router.post('/report', postController.reportPost);

router.post('/:id/comments',               commentController.addComment);
router.put('/:postId/comments/:commentId', commentController.updateComment);
router.delete('/:postId/comments/:commentId', commentController.deleteComment);

export default router;

