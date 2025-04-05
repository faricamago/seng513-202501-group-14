import React from "react";
import { GiDinosaurRex } from "react-icons/gi";
import ResponsiveImage from "./responsive-image";
import Link from "next/link";

interface PostProps {
  username: string;
  title: string;
  content: string;
  images?: string[];
  className?: string;
}

const Post: React.FC<PostProps> = ({ username, title, content, images, className }) => {
  return (
    <div className={`border-2 border-[var(--uoc-yellow)] rounded-lg bg-white shadow-md ${className}`}>
      <div className="p-4 flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          <GiDinosaurRex className="w-full h-full text-gray-400" />
        </div>
        <div className="flex flex-col flex-grow">
          {/* <h3 className="font-bold text-lg text-gray-900">{username}</h3> */}
          <Link href={`/profile?username=${username}`}>
           <h3 className="font-bold text-lg text-gray-900 hover:underline">{username}</h3>
         </Link>
          <h4 className="font-semibold text-md text-gray-800 mt-1">{title}</h4>
          <p className="text-gray-700 mt-1 leading-relaxed">{content}</p>
          {images && images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((imgPath, index) => {
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
                  src = `http://localhost:5000/uploads/${username}/${filename}`;
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
      <div className="bg-[var(--verylight-pink)] w-full flex rounded-b-lg space-x-4 p-4 mt-3 text-sm text-gray-500">
        <button className="hover:text-blue-500 transition">Like</button>
        <button className="hover:text-blue-500 transition">Comment</button>
        <button className="hover:text-blue-500 transition">Share</button>
      </div>
    </div>
  );
};

export default Post;
