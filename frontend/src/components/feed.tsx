"use client";
import React, { Suspense, useEffect, useState } from "react";
import Post from "./post";
import { PostType } from "./post";
import { useSearchParams } from "next/navigation";
import { BACKEND_PORT } from "@/common/global-vars";

interface FeedProps {
  className?: string;
  filterBy?: "following" | "mine" | "announcements";
  filterByUser?: string;
}

const Feed: React.FC<FeedProps> = ({ className, filterBy, filterByUser }) => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query") || "";

  //loading state added
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const url = queryParam
          ? `http://localhost:` + BACKEND_PORT + `/api/posts?query=${encodeURIComponent(
              queryParam
            )}`
          : "http://localhost:" + BACKEND_PORT + "/api/posts";
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data: PostType[] = await res.json();

        let processedPosts = data.map((post) => {
          if (Array.isArray(post.images)) {
            post.images = post.images.map((imgPath) =>
              typeof imgPath === "string"
                ? imgPath.replace(/\\/g, "/")
                : imgPath
            );
          }
          return post;
        });

        const loggedInUsername = sessionStorage.getItem("username");

        if (filterBy === "following") {
          if (loggedInUsername) {
            const followRes = await fetch(
              `http://localhost:` + BACKEND_PORT + `/api/users/following?username=${loggedInUsername}`
            );
            if (!followRes.ok)
              throw new Error("Failed to fetch following list");
            const followingList: string[] = await followRes.json();
            processedPosts = processedPosts.filter((post) =>
              followingList.includes(post.username)
            );
          }
        } else if (filterBy === "announcements") {
          const adminRes = await fetch(
            "http://localhost:" + BACKEND_PORT + "/api/users/admins"
          );
          if (!adminRes.ok) throw new Error("Failed to fetch admin users");
          const adminUsers: string[] = await adminRes.json();
          processedPosts = processedPosts.filter((post) =>
            adminUsers.includes(post.username)
          );
        } else if (filterBy === "mine") {
          if (loggedInUsername) {
            processedPosts = processedPosts.filter(
              (post) => post.username === loggedInUsername
            );
          }
        } else if (filterByUser) {
          processedPosts = processedPosts.filter(
            (post) => post.username === filterByUser
          );
        }

        const sortedPosts = processedPosts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [filterBy, filterByUser, queryParam]);

  if (loading) {
    return <p className="text-center">LOADING....</p>;
  }

  if (!loading && posts.length === 0) {
    if (filterBy === "following") {
      return (
        <p className="text-center">There are no posts by followed users.</p>
      );
    }
    if (filterBy === "mine") {
      return <p className="text-center">You haven't posted anything yet.</p>;
    }
    if (filterBy === "announcements") {
      return (
        <p className="text-center">There are no announcements right now.</p>
      );
    }
    return <p className="text-center">No posts available.</p>;
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {posts.map((post) => (
        <div key={post._id} className="w-full">
          <Post {...post} />
        </div>
      ))}
    </div>
  );
};

export default Feed;
