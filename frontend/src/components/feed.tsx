'use client'

import React, { useEffect, useState } from "react";
import Post from "./post";

interface PostType {
  _id: string;
  user: string;
  title: string;
  content: string;
  images?: string[];
}

interface FeedProps {
  className?: string;
}

const Feed: React.FC<FeedProps> = ({ className }) => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await res.json();

        // Process posts: ensure images use forward slashes.
        const processedPosts = data.map((post: PostType) => {
          if (Array.isArray(post.images)) {
            post.images = post.images.map((imgPath) => imgPath.replace(/\\/g, '/'));
          }
          return post;
        });

        // Optional: shuffle posts if desired
        const shuffledPosts = [...processedPosts].sort(() => Math.random() - 0.5);
        setPosts(shuffledPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {posts.map((post) => (
        <div key={post._id} className="w-full">
          <Post 
            username={post.user}
            title={post.title}
            content={post.content}
            images={post.images}
          />
        </div>
      ))}
    </div>
  );
};

export default Feed;
