"use client";
import React, { useState, useEffect, Suspense } from "react";
import { PostType } from "@/components/post"; // Adjust this path as needed
import Post from "@/components/post"; // Reuse the same Post component

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
      // Remove the approved post from the state
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
      // Remove the deleted post from the state
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
    </Suspense>
  );
};

export default Admin;
