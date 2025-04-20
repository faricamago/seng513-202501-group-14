"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LuLogOut, LuLogIn } from "react-icons/lu";
import { MdAdminPanelSettings } from "react-icons/md";
import { useRouter } from 'next/navigation';

const Header = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedRole = sessionStorage.getItem('role');
    if (storedUsername) setUsername(storedUsername);
    if (storedRole) setRole(storedRole);
  }, []);

  const confirmLogout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
    setUsername('');
    setShowLogoutModal(false);
    window.location.href = '/login';
  };

  const updateSearch = (query: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (query.trim() === "") {
        router.replace("/");
      } else {
        router.replace(`/?query=${encodeURIComponent(query.trim())}`);
      }
    }, 300);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    updateSearch(value);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[var(--primary-pink)] border-b-8 border-[var(--uoc-yellow)] md:px-16">
      <div className="flex items-center justify-between h-20 px-6">
        
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 hover:cursor-pointer">
          <img src="/assets/cuteredlogo.png" alt="Logo" className="w-20 h-auto" />
        </Link>

        {/* Search (only flex item) */}
        <div className="flex-1 mx-6">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="
              w-full
              px-4 py-2
              border border-gray-300
              rounded-md
              text-[var(--dark-color)]
              bg-[var(--verylight-pink)]
              focus:outline-none focus:ring-2 focus:ring-[var(--secondary-pink)]
            "
          />
        </div>

        {/* Right‑side controls */}
        <div className="flex items-center space-x-4">
          {role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="p-2 rounded-md hover:bg-white/20 transition relative group"
            >
              <MdAdminPanelSettings className="text-2xl text-white group-hover:text-[var(--uoc-yellow)]" />
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Reported Posts
              </span>
            </button>
          )}

          {username ? (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-2 rounded-md hover:bg-white/20 transition relative group"
            >
              <LuLogOut className="text-2xl text-white group-hover:text-[var(--uoc-yellow)]" />
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Logout
              </span>
            </button>
          ) : (
            <Link href="/login" className="p-2 rounded-md hover:bg-white/20 transition relative group flex items-center justify-center">
              <LuLogIn className="text-2xl text-white group-hover:text-[var(--uoc-yellow)]" />
              <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Login
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
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
