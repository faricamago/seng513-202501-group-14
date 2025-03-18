import React from "react";
import { FaUserCircle } from "react-icons/fa";

interface PostProps {
  username: string;
  content: string;
  className?: string;
}

const Post: React.FC<PostProps> = ({ username, content, className }) => {
  return (
    <div className={`border p-4 rounded-lg shadow-md bg-white flex items-start gap-4 ${className}`}>
      <div className="w-12 h-12 flex-shrink-0">
        <FaUserCircle className="w-full h-full text-gray-400" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900">{username}</h3>
        <p className="text-gray-700 mt-1 leading-relaxed">{content}</p>
        <div className="flex space-x-4 mt-3 text-sm text-gray-500">
          <button className="hover:text-blue-500 transition">Like</button>
          <button className="hover:text-blue-500 transition">Comment</button>
          <button className="hover:text-blue-500 transition">Share</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
