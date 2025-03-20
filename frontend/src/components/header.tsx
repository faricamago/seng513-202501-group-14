"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LuLogOut } from "react-icons/lu";
import { useRouter } from 'next/navigation';

const Header = () => {
  const [username, setUsername] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const confirmLogout = () => {
    sessionStorage.removeItem('username');
    setUsername('');
    setShowLogoutModal(false);
    window.location.href = '/login'; // Forces a full page reload
  };

  return (
    <header>
      <div className="fixed top-0 left-0 w-full h-20 z-40 bg-[var(--primary-pink)] flex items-center px-4">
        <Link href="/" className="w-1/8 flex items-center justify-center">
          <img src="/assets/DinoLogo.png" alt="Logo" className="w-20 h-[calc(100%-16px)]" />
        </Link>
        <div className="w-6/8 flex items-center justify-center">
          <input type="text" placeholder="Search..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--verylight-pink)] bg-white/50"/>
        </div>
        {username && (<button onClick={() => setShowLogoutModal(true)} className="w-1/8 flex items-center justify-center"><LuLogOut className="text-3xl text-white" /></button>
        )}
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-2xl font-bold text-center mb-4">Confirm Logout</h2>
            <p className="text-gray-700 text-center mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Cancel</button>
              <button onClick={confirmLogout} className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
