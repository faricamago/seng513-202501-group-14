// src/components/UserList.tsx

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { BACKEND_PORT } from '@/common/global-vars';
import Modal from './modal';

interface UserListProps {
  users: string[];
  title?: string;
  onClose: () => void;
}

const UserList: React.FC<UserListProps> = ({ users, title = 'Users', onClose }) => {
  const [profilePics, setProfilePics] = useState<Record<string, string>>({});
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const loggedInUsername = sessionStorage.getItem('username');

  useEffect(() => {
    users.forEach(async (username) => {
      // Fetch profile photo
      try {
        const res = await fetch(
          `http://localhost:${BACKEND_PORT}/api/users/profile?username=${username}`
        );
        if (res.ok) {
          const data = await res.json();
          setProfilePics((prev) => ({ ...prev, [username]: data.photo || '' }));
        }
      } catch (err) {
        console.error('Failed to fetch profile for', username, err);
      }
      // Fetch follow state if user is logged in
      if (loggedInUsername) {
        try {
          const res = await fetch(
            `http://localhost:${BACKEND_PORT}/api/users/following?username=${loggedInUsername}&target=${username}`
          );
          if (res.ok) {
            const data = await res.json();
            setFollowing((prev) => ({ ...prev, [username]: data.following }));
          }
        } catch (err) {
          console.error('Failed to fetch follow state for', username, err);
        }
      }
    });
  }, [users]);

  const toggleFollow = async (username: string) => {
    if (!loggedInUsername) return;
    const action = following[username] ? 'unfollow' : 'follow';
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: loggedInUsername, to: username }),
        }
      );
      if (res.ok) {
        setFollowing((prev) => ({ ...prev, [username]: !prev[username] }));
      }
    } catch (err) {
      console.error(`Failed to ${action}`, err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto">
          {users.map((username) => (
            <li key={username} className="flex items-center justify-between p-4 border-b last:border-0">
              <div className="flex items-center">
                <img
                  src={
                    profilePics[username]?.startsWith('http')
                      ? profilePics[username]
                      : `http://localhost:${BACKEND_PORT}/${profilePics[username]}`
                  }
                  alt={username}
                  className="w-10 h-10 rounded-full object-cover mr-3 bg-gray-200"
                />
                <span className="font-medium">{username}</span>
              </div>
              {loggedInUsername && loggedInUsername !== username && (
                <button
                  onClick={() => toggleFollow(username)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    following[username] ? 'bg-gray-200 text-gray-700' : 'bg-blue-500 text-white'
                  }`}>
                  {following[username] ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default UserList;