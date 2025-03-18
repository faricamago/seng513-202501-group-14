import React from "react";
import { GiDinosaurRex } from "react-icons/gi";

interface PostProps {
  username: string;
  content: string;
  image?: string;
  className?: string;
}

const Post: React.FC<PostProps> = ({ username, content, image, className }) => {
  return (
    <div className={`border p-4 rounded-lg shadow-md bg-white flex items-start gap-4 ${className}`}>
      <div className="w-12 h-12 flex-shrink-0">
        <GiDinosaurRex className="w-full h-full text-gray-400" />
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-900">{username}</h3>
        <p className="text-gray-700 mt-1 leading-relaxed">{content}</p>
        {image && (
          <img src={image} alt="Post image" className="mt-3 rounded-lg w-64 h-auto" />
        )}
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
