"use client";
import React from 'react';
import Feed from '@/components/feed'
import { useState, useEffect } from 'react';
const Profile = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent p-4">
      <img 
        src="/sample-profile/dino1.jpg" 
        alt="Profile" 
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
      />
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Trixie</h1>
      {username && (<h2 className="mt-2 text-lg text-gray-700">Username: {username}</h2>)}
      <p className="mt-2 mb-6 text-center text-gray-600 max-w-md">
        Trixie may be a T-Rex, but she's all heart! Despite her fierce reputation, she's a playful, curious little dino with a contagious smile. 
      </p>
      <Feed className='w-full'/>
    </div>
  );
};

export default Profile;
