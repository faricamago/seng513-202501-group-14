
import Post from '../models/Post.js';


export async function getComments(req, res) {
  try {
    const { postId } = req.query;
    const post = await Post.findById(postId).select('comments');
    return res.json(post ? post.comments : []);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function addComment(req, res) {
  try {
    const { postId, username, content } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

  
    post.comments.push({ username, content });
    await post.save();

    
    const newComment = post.comments[post.comments.length - 1];
    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}