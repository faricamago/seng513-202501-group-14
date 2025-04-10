"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LuLogOut } from "react-icons/lu";
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

  // Debounced function: update the URL query parameter as the user types.
  const updateSearch = (query: string) => {
    // Clear any previous timer.
    if (timerRef.current) clearTimeout(timerRef.current);
    // Start a new timer.
    timerRef.current = setTimeout(() => {
      // If query is empty, remove the query parameter entirely.
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
    <header>
      <div className="fixed top-0 left-0 w-full z-40 bg-[var(--primary-pink)] border-b-8 border-[var(--uoc-yellow)]">
        <div className="fixed top-0 left-0 w-full h-20 z-40 bg-[var(--primary-pink)] flex items-center px-4 border-b-8 border-[var(--uoc-yellow)]">
          <Link href="/" className="w-2/20 flex items-center justify-center max-sm:w-2/16 hover:cursor-pointer">
            <img src="/assets/cuteredlogo.png" alt="Logo" className="w-20 h-[calc(100%-16px)]" />
          </Link>
          <div className="w-16/20 flex items-center justify-center pr-1 max-sm:w-10/16">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 text-[var(--dark-color)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--secondary-pink)] bg-[var(--verylight-pink)]" 
            />
          </div>
          {role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="w-1/20 flex items-center justify-center pr-1 max-sm:w-2/16 cursor-pointer"
            >
              <MdAdminPanelSettings className="text-3xl text-white hover:text-[var(--uoc-yellow)]" />
            </button>
          )}
          {username && (
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="w-1/20 flex items-center justify-center max-sm:w-2/16 cursor-pointer"
            >
              <LuLogOut className="text-3xl text-white hover:text-[var(--uoc-yellow)]" />
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
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
