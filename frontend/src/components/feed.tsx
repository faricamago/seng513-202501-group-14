'use client'

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import Post from "./post";
import { PostType } from "./post";

interface FeedProps {
  className?: string;
  filterBy?: "following" | "mine" | "announcements";
  filterByUser?: string;
}

const Feed: React.FC<FeedProps> = ({ className, filterBy, filterByUser }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const searchParams = useSearchParams();
  const filterQuery = searchParams.get("filter");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data: PostType[] = await res.json();

        let processedPosts = data.map((post: PostType) => {
          if (Array.isArray(post.images)) {
            post.images = post.images.map((imgPath) => imgPath.replace(/\\/g, '/'));
          }
          return post;
        });

        // Apply filtering based on prop or query parameter
        if (filterBy === "following" || filterQuery === "following") {
          const loggedInUsername = sessionStorage.getItem("username");
          if (loggedInUsername) {
            const followRes = await fetch(`http://localhost:5000/api/users/following?username=${loggedInUsername}`);
            if (!followRes.ok) throw new Error("Failed to fetch following list");
            const followingList: string[] = await followRes.json();
            processedPosts = processedPosts.filter(post => followingList.includes(post.username));
          }
        } else if (filterBy === "announcements") {

          processedPosts = processedPosts.filter(post => {post.announcement === true});

        } else if (filterBy === "mine") {
          const loggedInUsername = sessionStorage.getItem("username");
          if (loggedInUsername) {
            processedPosts = processedPosts.filter(post => post.username === loggedInUsername);
          }
        }else if (filterByUser) {
             processedPosts = processedPosts.filter(post => post.username === filterByUser);
           }

        // Sort posts by createdAt date in descending order (latest first)
        const sortedPosts = processedPosts.sort(
          (a: PostType, b: PostType) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [filterBy,filterByUser,searchParams]);

  if (posts.length === 0) {
    if (filterBy === "following" || filterQuery === "following") {
      return <p className="text-center">There are no posts by followed users.</p>;
    }
    if (filterBy === "mine") {
      return <p className="text-center">You haven't posted anything yet.</p>;
    }
    return <p className="text-center">No posts available.</p>;
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {posts.map((post) => (
        <div key={post._id} className="w-full">
          <Post
            _id={post._id}
            username={post.username}
            title={post.title}
            content={post.content}
            images={post.images}
            announcement={post.announcement}
            createdAt={post.createdAt}
            likes={post.likes}
          />
        </div>
      ))}
    </div>
  );
};

export default Feed;
