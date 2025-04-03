'use client'

import React from "react";
import { useEffect, useState } from "react";

import { PostType, samplePosts } from "@/data/sample-posts";

import Post from "./post";

interface FeedProps {
  className?: string;
}

const Feed: React.FC<FeedProps> = ({ className }) => {

  const [shuffledPosts, setShuffledPosts] = useState<PostType[]>([]);

  useEffect(() => {
    //posts should be shuffled only when component mounts
    const shuffled = [...samplePosts].sort(() => Math.random() - 0.5);

    setShuffledPosts(shuffled);
  }, []); // Add an empty dependency array here

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {shuffledPosts.map((post, index) => (
        <div key={index} className="w-full">
          {post.image ? (
            <Post
              username={post.username}
              content={post.content}
              image={post.image}
            />
          ) : (
            <Post username={post.username} content={post.content} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
