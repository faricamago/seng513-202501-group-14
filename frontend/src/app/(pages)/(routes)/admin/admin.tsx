"use client";
import React, { useState, useEffect } from "react";
import { PostType } from "@/components/post"; // Adjust this path as needed
import Link from "next/link";
import ResponsiveImage from "@/components/responsive-image";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { FaRegComment, FaRegFlag } from "react-icons/fa";

const Admin = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch flagged posts from the admin endpoint
  useEffect(() => {
    const fetchFlaggedPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/flagged-posts");
        if (!res.ok) {
          throw new Error("Failed to fetch flagged posts.");
        }
        const data = await res.json();
        setFlaggedPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlaggedPosts();
  }, []);

  // Approve a flagged post by removing its reported flag
  const handleApprove = async (postId: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/approve-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) {
        throw new Error("Failed to approve post.");
      }
      // Remove the approved post from the current state
      setFlaggedPosts(flaggedPosts.filter((post) => post._id !== postId));
      alert("Post approved successfully.");
    } catch (error) {
      console.error(error);
      alert("Error approving post.");
    }
  };

  // Delete a flagged post completely
  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/delete-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (!res.ok) {
        throw new Error("Failed to delete post.");
      }
      // Remove the deleted post from the current state
      setFlaggedPosts(flaggedPosts.filter((post) => post._id !== postId));
      alert("Post deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Error deleting post.");
    }
  };

  if (loading) {
    return <div className="p-4">Loading flagged posts...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {flaggedPosts.length === 0 ? (
        <p>No flagged posts available.</p>
      ) : (
        flaggedPosts.map((post) => (
          <AdminPostCard 
            key={post._id} 
            post={post} 
            onApprove={handleApprove} 
            onDelete={handleDelete} 
          />
        ))
      )}
    </div>
  );
};

interface AdminPostCardProps {
  post: PostType;
  onApprove: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const AdminPostCard: React.FC<AdminPostCardProps> = ({ post, onApprove, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);
  const loggedInUsername = sessionStorage.getItem("username");

  useEffect(() => {
    if (loggedInUsername && post.likes) {
      setIsLiked(post.likes.includes(loggedInUsername));
    }
  }, [loggedInUsername, post.likes]);

  const ToggleLikePost = async (postId: string) => {
    if (!loggedInUsername) {
      alert("Please log in to like posts.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: postId, loggedInUsername }),
      });
      if (!res.ok) throw new Error("Failed to toggle like status.");
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="border-2 border-[var(--uoc-yellow)] rounded-lg bg-white shadow-md mb-4 p-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          {/* User avatar placeholder */}
          <span className="block w-full h-full bg-gray-300 rounded-full"></span>
        </div>
        <div className="flex flex-col flex-grow">
          <Link href={`/profile?username=${post.username}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:underline">{post.username}</h3>
          </Link>
          <h4 className="font-semibold text-md text-gray-800 mt-1">{post.title}</h4>
          <p className="text-gray-700 mt-1 leading-relaxed">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {post.images.map((imgPath, index) => {
                let src;
                if (imgPath.startsWith("http")) {
                  src = imgPath;
                } else {
                  const fixedPath = imgPath.replace(/\\/g, "/");
                  const parts = fixedPath.split("/");
                  const filename = parts[parts.length - 1];
                  src = `http://localhost:5000/uploads/${post.username}/${filename}`;
                }
                return (
                  <ResponsiveImage
                    key={index}
                    src={src}
                    alt={`Post image ${index + 1}`}
                    className="rounded-lg w-64 h-auto"
                  />
                );
              })}
            </div>
          )}
          <p className="text-sm text-red-600 mt-2">Flagged for review</p>
        </div>
      </div>
      <div className="bg-[var(--verylight-pink)] w-full flex flex-wrap gap-4 p-4 mt-3 text-sm text-gray-500">
        {/* Regular User Actions */}
        <div className="flex items-center gap-2">
          <button className="hover:text-blue-500 transition text-2xl" onClick={() => ToggleLikePost(post._id)}>
            {isLiked ? <BiSolidLike /> : <BiLike />}
          </button>
          <span className="text-md font-bold">{likeCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="hover:text-blue-500 transition text-2xl">
            <FaRegComment />
          </button>
          <span className="text-md font-bold">42</span>
        </div>
        {/* Admin Moderation Actions */}
        <div className="flex items-center gap-2">
          <button 
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={() => onApprove(post._id)}
          >
            Approve
          </button>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => onDelete(post._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
