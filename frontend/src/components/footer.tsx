"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuEarth, LuSchool } from "react-icons/lu";
import { MdOutlinePeopleAlt, MdOutlinePersonOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import TipTapEditor from "./TipTapEditor"; // adjust the path as needed
import PostForm from "./postForm";

const Footer: React.FC = () => {
  const [username, setUsername] = useState("");
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const confirmPost = () => {
    // In a real scenario, you may want to get the editor content via context or refs.
    // For now, this placeholder simply logs a confirmation.
    console.log("Post confirmed");
    setShowPostModal(false);
  };

  const handlePost = async (data: { title: string; content: string; newImages?: File[]; keptImages?: string[] }) => {
    if (!data.title || !data.content) {
      // alert("Please fill in the title and content.");
      return;
    }
    // Create a FormData object to send files and other fields
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("username", username); // Replace with the actual user id
    
    // Append new image files if they exist (for a new post, keptImages will be empty)
    if (data.newImages && data.newImages.length > 0) {
      data.newImages.forEach((file) => {
        formData.append("images", file);
      });
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      console.log("Post created successfully!");
    } catch (err) {
      console.error(err);
    }
    setShowPostModal(false);
  };
  

  const handlePlusClick = () => {
    if (username) {
      setShowPostModal(true);
    } else {
      setLoginMessage("Login to add a post");
      setShowLoginModal(true);
    }
  };

  const handleWorldClick = () => {
    window.location.href = "/";
  }

  const handleAnnouncementsClick = () => {
    window.location.href = "/announcements";
  };

  const handleFollowersClick = () => {
    if (username) {
      // Navigate to feed page with filter parameter set to "following"
      window.location.href = "/following";
    } else {
      setLoginMessage("Login to see posts from followers");
      setShowLoginModal(true);
    }
  };

  const handleProfileClick = () => {
    if (username) {
      window.location.href = "/profile";
    } else {
      setLoginMessage("Login to see your profile");
      setShowLoginModal(true);
    }
  };

  const goToLogin = () => {
    setShowLoginModal(false);
    window.location.href = "/login";
  };

  const accountRoute = username ? "/profile" : "/login";

  return (
    <footer>
      <nav className="fixed bottom-0 left-0 w-full h-16 z-40 flex bg-[var(--primary-pink)] text-white border-t-8 border-[var(--uoc-yellow)]">
        
        {/* See All Posts Button */}
        <button className="relative group flex-1 flex group h-full items-center justify-center p-4 hover:cursor-pointer hover:bg-[var(--hover-primary-pink)]" onClick={handleWorldClick}>
          <LuEarth className="text-3xl group-hover:text-[var(--uoc-yellow)] cursor-pointer" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
            See All Posts
          </span>
        </button>

        {/* University Posts Button */}
        <button className="relative group flex-1 flex group items-center justify-center p-4 hover:cursor-pointer hover:bg-[var(--hover-primary-pink)]" onClick={handleAnnouncementsClick}>
          <LuSchool className="text-3xl group-hover:text-[var(--uoc-yellow)] cursor-pointer" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
              See Posts By University
          </span>
        </button>
         
        {/* New Post Button */}
        <div className="group flex-1 flex items-center justify-center relative">
          <div className="bg-white text-[var(--primary-pink)] w-15 h-12 flex items-center justify-center 
                        rounded-md border-2 border-[var(--primary-pink)] absolute -top-4 cursor-pointer"
               onClick={handlePlusClick}>
            <FiPlus className="text-2xl hover:text-[var(--uoc-yellow)]" />
          </div>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add a New Post
          </span>
        </div>

        {/* Friends Button */}
        <button className="relative group flex-1 flex group items-center justify-center p-4 hover:cursor-pointer hover:bg-[var(--hover-primary-pink)]" onClick={handleFollowersClick}>
          <MdOutlinePeopleAlt className="text-3xl group-hover:text-[var(--uoc-yellow)] cursor-pointer" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
              See Post by People You Follow
          </span>
        </button>

        {/* Profile Button */}
        <button className="relative group flex-1 flex group items-center justify-center p-4 hover:cursor-pointer hover:bg-[var(--hover-primary-pink)]" onClick={handleProfileClick}>
          <MdOutlinePersonOutline className="text-3xl group-hover:text-[var(--uoc-yellow)] cursor-pointer" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Profile
          </span>
        </button>

      </nav>

      {showPostModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col">
            <h2 className="text-2xl font-bold text-[var(--dark-color)] text-center mb-4 p-4">
              Add a Post
            </h2>
            <div className="flex-grow overflow-y-auto p-4">
              <PostForm onCancel={() => setShowPostModal(false)} onPost={handlePost} />
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">Please Login</h2>
            <p className="text-gray-700 text-center mb-6">{loginMessage}</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowLoginModal(false)} className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition">
                Cancel
              </button>
              <button onClick={goToLogin} className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition">
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
