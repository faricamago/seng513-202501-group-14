"use client";
import React from 'react';
import Link from 'next/link';
import { LuEarth } from "react-icons/lu";
import { LuSchool } from "react-icons/lu";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { useState, useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';


const Footer = () => {
    const [username, setUsername] = useState('');
    const [showPostModal, setShowPostModal] = useState(false);

    useEffect(() => {
      const storedUsername = sessionStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }, []);

    const confirmPost = () => {
      const contentHTML = editor ? editor.getHTML() : '';
      console.log("Post Content:", contentHTML);
      // Insert your logic to handle the post (e.g., send it to your backend)
    
      setShowPostModal(false);
    };
    

    const handlePlusClick = () => {
      if (username) {
        setShowPostModal(true);
      } else {
        window.location.href = '/login';
      }
    };
    const editor = useEditor({
      extensions: [
        StarterKit,
        Image,
      ],
      content: '',
      immediatelyRender: false,
    });
    
    const accountRoute = username ? '/profile' : '/login'
  return (
    <footer>
      <nav className={`fixed bottom-0 left-0 w-full h-16 z-40 flex bg-[var(--primary-pink)] text-white`}>
          <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
              <LuEarth className="text-3xl" />
          </div>
          <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
              <LuSchool className="text-3xl" />
          </div>
          <div className="flex-1 flex items-center justify-center relative">
              <div className="bg-white text-[var(--primary-pink)] w-15 h-12 flex items-center justify-center 
                              rounded-md border-2 border-[var(--primary-pink)] absolute -top-4" onClick={handlePlusClick}>
              <FiPlus className="text-2xl" />
              </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)]">
              <MdOutlinePeopleAlt className="text-3xl" />
          </div>
          <Link href={accountRoute} className="flex-1 flex items-center justify-center p-4 hover:bg-[var(--bright-pink)] cursor-pointer">
              <MdOutlinePersonOutline className="text-3xl" />
          </Link>
      </nav>
      {showPostModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-center mb-4">Add a Post</h2>
            {/* Tiptap Editor handling title, description, and images */}
            <div className="mb-4">
              <EditorContent 
                editor={editor} 
                className="border border-gray-300 rounded p-2"
                placeholder="Enter title, description, and add images here..."
              />
            </div>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowPostModal(false)} 
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPost} 
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

export default Footer