import React, { useState, useEffect } from "react";

interface CommentType {
  id: string;
  username: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  postID: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postID }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/posts/${postID}/comments`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data: CommentType[] = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [postID]);

  //Add comment event handler
  const handleAddComment = async () => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      alert("Please login to comment");
      return;
    }
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:5000/api/posts/${postID}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            content: newComment.trim(),
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to add comment");
      }
      const createdComment = await res.json();
      setComments([...comments, createdComment]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error adding comment.");
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-bold mb-2">Comments</h4>

      {comments.length === 0 ? (
        <p className="text-gray-600 text-sm">No comments yet. Be the first!</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="mb-2 p-2 border-b">
            <p className="text-sm font-bold">{comment.username}</p>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))
      )}

      <div className="flex mt-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow border rounded p-2"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
