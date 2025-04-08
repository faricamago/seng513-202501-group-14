import React from "react";
import { GiDinosaurRex } from "react-icons/gi";
import ResponsiveImage from "./responsive-image";
import Link from "next/link";
import { useState } from "react";
import { useEffect } from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { FaRegFlag } from "react-icons/fa";

export interface PostType {
  _id: string;
  username: string;
  title: string;
  content: string;
  images?: string[];
  announcement: boolean;
  createdAt: Date;
  likes: string[];
  className?: string;
}

const Post: React.FC<PostType> = (props) => {

  const [isLiked, setIsLiked] = useState(false);
  const loggedInUsername = sessionStorage.getItem("username");
  const [likeCount, setLikeCount] = useState(props.likes ? props.likes.length : 0);
  
  useEffect(() => {
    if (loggedInUsername && props.likes) {
      setIsLiked(props.likes.includes(loggedInUsername));
    }
  }, [loggedInUsername, props.likes]);

  const ToggleLikePost = async (_id: string) => {
    const loggedInUsername = sessionStorage.getItem("username");
    if (!loggedInUsername) {
      alert("Please log in to like a post.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          loggedInUsername,
        }),
      });
  
      if (!res.ok) {
        throw new Error("Failed to like the post, got _id " + _id);
      }
  
      setIsLiked(!isLiked) // Toggle the like state
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1); // Update the like count
  
      console.log("Post liked successfully!");
    } catch (err) {
      console.error(err);
    }
  }
  const reportPost = async (postId: string) => {
    const loggedInUsername = sessionStorage.getItem("username");
    if (!loggedInUsername) {
      alert("Please log in to report a post.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/posts/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          reportedBy: loggedInUsername,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to report the post");
      }
      alert("Post reported successfully");
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };


  return (
    <div className={`border-2 border-[var(--uoc-yellow)] rounded-lg bg-white shadow-md ${props.className}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          <GiDinosaurRex className="w-full h-full text-gray-400" />
        </div>
        <div className="flex flex-col flex-grow">
          {/* <h3 className="font-bold text-lg text-gray-900">{username}</h3> */}
          <Link href={`/profile?username=${props.username}`}>
           <h3 className="font-bold text-lg text-gray-900 hover:underline">{props.username}</h3>
         </Link>
          <h4 className="font-semibold text-md text-gray-800 mt-1">{props.title}</h4>
          <p className="text-gray-700 mt-1 leading-relaxed">{props.content}</p>
          {props.images && props.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {props.images.map((imgPath, index) => {
                let src;
                if (imgPath.startsWith("http")) {
                  src = imgPath;
                } else {
                  // Replace backslashes with forward slashes
                  const fixedPath = imgPath.replace(/\\/g, '/');
                  // Extract the filename from the stored path
                  const parts = fixedPath.split('/');
                  const filename = parts[parts.length - 1];
                  // Build the full image URL assuming images are stored in backend/upload/<username> folder
                  src = `http://localhost:5000/uploads/${props.username}/${filename}`;
                  console.log("Image URL:", src);
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
        </div>
      </div>
      <div className="bg-[var(--verylight-pink)] w-full flex gap-8 p-4 mt-3 text-sm text-gray-500">
        
        {/* Likes */}
        <div className='flex items-center gap-2'>
          <button
            className="hover:text-blue-500 transition text-2xl"
            onClick={() => ToggleLikePost(props._id)}
          >
            {isLiked ?
            <BiSolidLike /> :
            <BiLike />}
          </button>
          <span className="text-md font-bold">
            {likeCount}
          </span>
        </div>

        {/* Comments */}
        <div className='flex items-center gap-2'>
          <button className="hover:text-blue-500 transition text-2xl">
            <FaRegComment />
          </button>
          <span className="text-md font-bold">
            42
          </span>
        </div>
        {/* Report */}
        <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 hover:text-blue-500 transition transition"
              onClick={() => reportPost(props._id)}
            >
              <FaRegFlag className="text-2xl" />
              <span>Report</span>
            </button>
        </div>

      </div>
    </div>
  );
};

export default Post;
