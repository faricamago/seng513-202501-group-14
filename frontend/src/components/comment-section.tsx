"use client";
import React, { useState, useEffect } from "react";
import { BACKEND_PORT } from "@/common/global-vars";
import { FaCommentSlash } from "react-icons/fa";

interface CommentType {
  username: string;
  content: string;
  createdAt?: string;
  index: number;
  likes?: string[];
}

const CommentSection: React.FC<{ postId: string }> = ({ postId }) => {
  console.log("CommentSection loaded for post:", postId);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [showComments, setShowComments] = useState(true);

  // Fetch comments
  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `http://localhost:${BACKEND_PORT}/api/comments?postId=${postId}`
        );
        if (res.ok) {
          const data: CommentType[] = await res.json();
          setComments(data.map((c, i) => ({ ...c, index: i })));
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      }
    }
    fetchComments();
  }, [postId]);

  // Add a new comment
  const handleAddComment = async (content: string) => {
    const username = sessionStorage.getItem("username");
    if (!username) {
      return;
    }
    try {
      const res = await fetch(`http://localhost:${BACKEND_PORT}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, username, content }),
      });
      if (res.ok) {
        const newComment: CommentType = await res.json();
        setComments((prev) => [...prev, { ...newComment, index: prev.length }]);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };
  //delete a comment
  const handleDeleteComment = async (index: number) => {
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/comments/${postId}/${index}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.index !== index));
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  //like a comment
  const handleLikeComment = async (index: number) => {
    const username = sessionStorage.getItem("username");
    if (!username) return;

    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/comments/${postId}/${index}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments((prev) =>
          prev.map((c) => (c.index === index ? { ...c, likes: data.likes } : c))
        );
      }
    } catch (err) {
      console.error("Failed to like comment:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg mt-6">
      <h4 className="text-xl font-bold text-[var(--primary-pink)] mb-4 border-b border-[var(--verylight-pink)] pb-2">
        Comments
      </h4>
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-sm text-[var(--primary-pink)] font-semibold mb-4 underline hover:text-[var(--bright-pink)] transition"
      >
        {showComments ? "Hide comments" : "Show comments"} ({comments.length})
      </button>
      {showComments && (
        <div className="flex flex-col gap-4">
          {comments.map((c) => (
            <div
              key={c.index}
              className="p-4 bg-[var(--verylight-pink)] rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[var(--primary-pink)]">
                  {c.username}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {new Date(c.createdAt || "").toLocaleString()}
                  </span>
                  {sessionStorage.getItem("username") === c.username && (
                    <div>
                      <button
                        onClick={() => handleDeleteComment(c.index)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => handleLikeComment(c.index)}
                        className={`text-sm ${
                          c.likes?.includes(
                            sessionStorage.getItem("username") || ""
                          )
                            ? "text-[var(--primary-pink)] font-bold"
                            : "text-gray-500"
                        } hover:underline`}
                      >
                        ❤️ {c.likes?.length || 0}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-[var(--foreground)]">{c.content}</p>
            </div>
          ))}
        </div>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const input = form.elements.namedItem("comment") as HTMLInputElement;
          const text = input.value.trim();
          if (text) {
            handleAddComment(text);
            input.value = "";
          }
        }}
        className="mt-6 flex gap-2"
      >
        <input
          name="comment"
          type="text"
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary-pink)] focus:border-[var(--primary-pink)]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded-lg hover:bg-[var(--bright-pink)] transition"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
