import React from 'react';

const Navbar = () => {
  return (
    <nav className={`fixed top-0 left-0 w-full h-16 z-40 bg-[var(--primary-pink)] flex items-center`}>
      <div className="w-1/8 items-center justify-items-center">
        <img src="/assets/DinoLogo.png" alt="Logo" className="w-20 h-[calc(100%-16px)]" />
      </div>
      <div className="w-6/8 items-center justify-items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--verylight-pink)] bg-white/50"
        />
      </div>
    </nav>
  );
};

export default Navbar;
