import React, { useState, useEffect } from "react";
import { GiDinosaurRex } from "react-icons/gi";
import ResponsiveImage from "./responsive-image";
import Link from "next/link";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import PostForm from "./postForm";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
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
  const normalizeToRelative = (url: string) => {
    // If the image path starts with "http://localhost:5000/", strip that part out.
    // Also convert backslashes to forward slashes, just in case.
    return url
      .replace(/^https?:\/\/[^/]+\//, '') // remove "http://localhost:5000/"
      .replace(/\\/g, '/');               // convert backslashes to slashes
  };
  const [isLiked, setIsLiked] = useState(false);
  const loggedInUsername = sessionStorage.getItem("username");
  const [likeCount, setLikeCount] = useState(props.likes ? props.likes.length : 0);

  // States for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (loggedInUsername && props.likes) {
      setIsLiked(props.likes.includes(loggedInUsername));
    }
  }, [loggedInUsername, props.likes]);

  const ToggleLikePost = async (_id: string) => {
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

      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      console.log("Post liked successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // Edit handler: use FormData to send both keptImages and newImages
  // ... inside your handleEditPost function in post.tsx
  const handleEditPost = async (data: { title: string; content: string; newImages: File[]; keptImages: string[] }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    // Add the username (from session storage or however you store it)
    const username = sessionStorage.getItem("username") || "default";
    formData.append("username", username);
    // Send kept images as a JSON string
    formData.append("keptImages", JSON.stringify(data.keptImages));
    data.newImages.forEach(file => {
      formData.append("images", file);
    });

    try {
      const res = await fetch(`http://localhost:5000/api/posts/${props._id}`, {
        method: "PUT",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Failed to update post");
      }
      console.log("Post updated successfully!");
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Delete handler: sends DELETE request and relies on backend to remove images
  const handleDeletePost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/posts/${props._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete post");
      }
      console.log("Post deleted successfully!");
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
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
                  const fixedPath = imgPath.replace(/\\/g, '/');
                  const parts = fixedPath.split('/');
                  const filename = parts[parts.length - 1];
                  src = `http://localhost:5000/uploads/${props.username}/${filename}`;
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
      {/* Like and Comment Section */}
      <div className="bg-[var(--verylight-pink)] w-full flex gap-8 p-4 mt-3 text-sm text-gray-500">
        <div className='flex items-center gap-2'>
          <button
            className="hover:text-blue-500 transition text-2xl"
            onClick={() => ToggleLikePost(props._id)}
          >
            {isLiked ? <BiSolidLike /> : <BiLike />}
          </button>
          <span className="text-md font-bold">{likeCount}</span>
        </div>
        <div className='flex items-center gap-2'>
          <button className="hover:text-blue-500 transition text-2xl">
            <FaRegComment />
          </button>
          <span className="text-md font-bold">42</span>
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
        <div className="flex-grow" />
        {loggedInUsername === props.username && (
          <div className="flex items-end space-x-2 p-4">
            <button
              className="hover:text-blue-500 transition text-2xl"
              onClick={() => setShowEditModal(true)}
            >
              <MdOutlineModeEdit />
            </button>
            <button
              className="hover:text-blue-500 transition text-2xl"
              onClick={() => setShowDeleteModal(true)}
            >
              <MdDeleteOutline />
            </button>
          </div>
        )}
      </div>

      {/* Edit Post Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold text-[var(--dark-color)] text-center mb-4 p-4">
              Edit Post
            </h2>
            <div className="flex-grow overflow-y-auto p-4">
              <PostForm
                onCancel={() => setShowEditModal(false)}
                onPost={handleEditPost}
                isEdit={true}
                initialTitle={props.title}
                initialContent={props.content}
                initialImages={props.images || []}
              />
            </div>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">Confirm Delete</h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
