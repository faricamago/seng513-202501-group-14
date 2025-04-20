"use client";
import React, { useState, useEffect, Suspense } from "react";
import { PostType } from "@/components/post"; // Adjust this path as needed
import Post from "@/components/post"; // Reuse the same Post component

const Admin = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

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
      // Remove the approved post from the state
      setFlaggedPosts(flaggedPosts.filter((post) => post._id !== postId));
      setMessage("Post approved successfully.");
      setTitle("Approved!");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setMessage("Error approving post.");
      setTitle("Error!");
      setShowModal(true);
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
      // Remove the deleted post from the state
      setFlaggedPosts(flaggedPosts.filter((post) => post._id !== postId));
      setMessage("Post deleted successfully.");
      setTitle("Deleted!");
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setMessage("Error deleting post.");
      setTitle("Error!");
      setShowModal(true);
    }
  };

  if (loading) {
    return <div className="p-4">LOADING...</div>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        {flaggedPosts.length === 0 ? (
          <p>No flagged posts available.</p>
        ) : (
          flaggedPosts.map((post) => (
            <div key={post._id} className="mb-4">
              <Post
                {...post}
                adminView={true}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            </div>
          ))
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
            {title}
            </h2>
            <p className="text-gray-700 text-center mb-6">
              {message}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
};

export default Admin;
