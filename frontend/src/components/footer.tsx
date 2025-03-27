"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LuEarth, LuSchool } from "react-icons/lu";
import { MdOutlinePeopleAlt, MdOutlinePersonOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import TipTapEditor from "./TipTapEditor"; // adjust the path as needed

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

  const handlePlusClick = () => {
    if (username) {
      setShowPostModal(true);
    } else {
      setLoginMessage("In order to add a post you need to login.");
      setShowLoginModal(true);
    }
  };
  const handleFollowersClick = () => {
    if (username) {
      // Make it do whatever it is supposed to do
    } else {
      setLoginMessage("In order to see your followers' post, you need to login.");
      setShowLoginModal(true);
    }
  };
  const handleProfileClick = () => {
    if (username) {
        window.location.href = "/login";
    } else {
      setLoginMessage("In order to see your profile, you need to login.");
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
      <nav className="fixed bottom-0 left-0 w-full h-16 z-40 flex bg-[var(--primary-pink)] text-white">
        <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
          <LuEarth className="text-3xl" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
          <LuSchool className="text-3xl" />
        </div>
        <div className="flex-1 flex items-center justify-center relative">
          <div
            className="bg-white text-[var(--primary-pink)] w-15 h-12 flex items-center justify-center 
                        rounded-md border-2 border-[var(--primary-pink)] absolute -top-4 cursor-pointer"
            onClick={handlePlusClick}
          >
            <FiPlus className="text-2xl" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)] "  onClick={handleFollowersClick}>
          <MdOutlinePeopleAlt className="text-3xl" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)] "  onClick={handleProfileClick}>
          <MdOutlinePersonOutline className="text-3xl" />
        </div>
      </nav>
      {showPostModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto max-h-[90vh] flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4 p-4">Add a Post</h2>
          <div className="flex-grow overflow-y-auto p-4">
            <TipTapEditor content="" />
          </div>
          <div className="flex justify-center space-x-4 p-4">
            <button onClick={() => setShowPostModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Cancel
            </button>
            <button onClick={confirmPost} className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)]">
              Post
            </button>
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
              <button onClick={() => setShowLoginModal(false)} className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition">Cancel</button>
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
