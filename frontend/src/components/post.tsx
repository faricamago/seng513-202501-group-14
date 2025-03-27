import React from "react";
import { GiDinosaurRex } from "react-icons/gi";
import ResponsiveImage from "./responsive-image";

interface PostProps {
  username: string;
  content: string;
  image?: string;
  className?: string;
}

const Post: React.FC<PostProps> = ({ username, content, image, className }) => {
  return (
    <div className={`border-2 border-[var(--uoc-yellow)] rounded-lg bg-white shadow-md ${className}`}>
      <div className={`p-4 flex items-start gap-4`}>
        <div className="w-12 h-12 flex-shrink-0">
          <GiDinosaurRex className="w-full h-full text-gray-400" />
        </div>
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-lg text-gray-900">{username}</h3>
          <p className="text-gray-700 mt-1 leading-relaxed">{content}</p>
          {image && (
            <ResponsiveImage src={image} alt="Post image" className="mt-3 rounded-lg w-64 h-auto" />
          )}
          </div>
        </div>
        <div className="bg-[var(--verylight-pink)] w-full flex rounded-b-lg space-x-4 p-4 mt-3 text-sm text-gray-500">
          <button className="hover:text-blue-500 transition">Like</button>
          <button className="hover:text-blue-500 transition">Comment</button>
          <button className="hover:text-blue-500 transition">Share</button>
        </div>
      </div>
  );
};

export default Post;
