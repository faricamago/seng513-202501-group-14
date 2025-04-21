import React, { useState, useEffect } from "react";
import { GiDinosaurRex } from "react-icons/gi";
import ResponsiveImage from "./responsive-image";
import Link from "next/link";
import { BiLike, BiSolidLike } from "react-icons/bi";
//import { FaRegComment } from "react-icons/fa";
import PostForm from "./postForm";
import { MdOutlineModeEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegFlag } from "react-icons/fa";
import { BACKEND_PORT } from "@/common/global-vars";
import UserList from "./userList";
import CommentSection from "./comment-section";

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
  // Admin-specific props:
  adminView?: boolean;
  onApprove?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

const Post: React.FC<PostType> = (props) => {
  // State for author's profile picture
  const [authorPhoto, setAuthorPhoto] = useState<string>("");
  const loggedInUsername = sessionStorage.getItem("username");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(
    props.likes ? props.likes.length : 0
  );

  // States for modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    if (loggedInUsername && props.likes) {
      setIsLiked(props.likes.includes(loggedInUsername));
    }
  }, [loggedInUsername, props.likes]);

  const goToLogin = () => {
    setShowLoginModal(false);
    window.location.href = "/login";
  };

  // Fetch author's profile photo
  useEffect(() => {
    async function fetchAuthorPhoto() {
      try {
        const res = await fetch(
          `http://localhost:${BACKEND_PORT}/api/users/profile?username=${props.username}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.photo) {
            setAuthorPhoto(data.photo);
          }
        }
      } catch (error) {
        console.error("Error fetching author photo:", error);
      }
    }
    fetchAuthorPhoto();
  }, [props.username]);

  const ToggleLikePost = async (_id: string) => {
    if (!loggedInUsername) {
      setLoginMessage("Log in to like a post");
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/posts/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            _id,
            loggedInUsername,
          }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to like the post");
      }
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      console.log("Post liked successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPost = async (data: {
    title: string;
    content: string;
    newImages: File[];
    keptImages: string[];
  }) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    const username = sessionStorage.getItem("username") || "default";
    formData.append("username", username);
    formData.append("keptImages", JSON.stringify(data.keptImages));
    data.newImages.forEach((file) => {
      formData.append("images", file);
    });
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/posts/${props._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
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

  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/posts/${props._id}`,
        {
          method: "DELETE",
        }
      );
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
      setLoginMessage("Log in to report a post");
      setShowLoginModal(true);
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/posts/report`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId, reportedBy: loggedInUsername }),
        }
      );
      if (!res.ok) {
        throw new Error("Failed to report the post");
      }
      console.log("Post reported successfully!");
      setShowReportConfirm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  };

  // Render controls based on adminView prop.
  const renderControls = () => {
    if (props.adminView === true) {
      return (
        <div className="flex items-center gap-2">
          <button
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
            onClick={() => props.onApprove && props.onApprove(props._id)}
          >
            Approve
          </button>
          <button
            className="bg-[var(--primary-pink)] text-white px-3 py-1 rounded hover:bg-red-600 transition"
            onClick={() => props.onDelete && props.onDelete(props._id)}
          >
            Delete
          </button>
        </div>
      );
    } else {
      return (
        <>
          <div className="flex items-center gap-2">
            <button
              className="hover:text-blue-500 transition text-2xl"
              onClick={() => ToggleLikePost(props._id)}
            >
              {isLiked ? <BiSolidLike /> : <BiLike />}
            </button>
            <span
              className="text-md font-bold cursor-pointer hover:underline"
              onClick={() => setShowLikesModal(true)}
            >
              {likeCount}
            </span>
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
          {loggedInUsername !== props.username && (
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-3 py-1 hover:text-blue-500 transition"
                onClick={() => {
                  if (loggedInUsername) {
                    setShowReportConfirm(true);
                  } else {
                    setLoginMessage("Log in to report a post");
                    setShowLoginModal(true);
                  }
                }}
              >
                <FaRegFlag className="text-lg sm:text-2xl" />
                <span>Report</span>
              </button>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div
      className={`border-2 border-[var(--uoc-yellow)] rounded-lg bg-white shadow-md ${props.className}`}
    >
      <div className="p-4 flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          {authorPhoto ? (
            <img
              src={
                authorPhoto.startsWith("http")
                  ? authorPhoto
                  : `http://localhost:5000/${authorPhoto}`
              }
              alt={props.username}
              className="w-full h-full rounded-full object-cover border-2 border-[var(--verylight-pink)]"
            />
          ) : (
            <GiDinosaurRex className="w-full h-full text-[var(--verylight-pink)] rounded-full" />
          )}
        </div>
        <div className="flex flex-col flex-grow">
          <Link href={`/profile?username=${props.username}`}>
            <h3 className="font-bold text-lg text-gray-900 hover:underline">
              {props.username}
            </h3>
          </Link>
          <h4 className="font-semibold text-md text-gray-800 mt-1">
            {props.title}
          </h4>
          <p className="text-gray-700 mt-1 leading-relaxed">{props.content}</p>
          {props.images && props.images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {props.images.map((imgPath, index) => (
                <ResponsiveImage
                  key={index}
                  src={imgPath}
                  alt={`Post image ${index + 1}`}
                  className="rounded-lg w-64 h-auto"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CommentSection postId={props._id} />
      <div className="bg-[var(--verylight-pink)] w-full flex items-center flex-wrap gap-2 sm:gap-4 p-4 mt-3 text-sm text-gray-500">
        {renderControls()}
      </div>
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
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Confirm Delete
            </h2>
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
      {/* Report Confirmation Modal on show if logged in!*/}
      {showReportConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Report Post
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to report this post to the uni admin?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowReportConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => reportPost(props._id)}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Login Confirmation Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Please Login
            </h2>
            <p className="text-gray-700 text-center mb-6">{loginMessage}</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={goToLogin}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
      {showLikesModal && (
        <UserList
          title="Likes"
          users={props.likes}
          onClose={() => setShowLikesModal(false)}
        />
      )}
    </div>
  );
};

export default Post;
