// src/components/UserList.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { BACKEND_PORT } from '@/common/global-vars';
import Modal from './modal';
import Link from 'next/link';

interface UserListProps {
  users: string[];
  title?: string;
  onClose: () => void;
}

interface UserCardProps {
  username: string;
  profilePic?: string;
  initialFollowing: boolean;
  loggedInUsername: string | null;
}

// Reusable card for a single user
const UserCard: React.FC<UserCardProps> = ({
  username,
  profilePic,
  initialFollowing,
  loggedInUsername,
}) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [followStatus, setFollowStatus] = useState(
    initialFollowing ? 'Following' : 'Follow'
  );

  useEffect(() => {
    setIsFollowing(initialFollowing);
    setFollowStatus(initialFollowing ? 'Following' : 'Follow');
  }, [initialFollowing]);

  const handleToggle = async () => {
    if (!loggedInUsername) return;
    const action = isFollowing ? 'unfollow' : 'follow';
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/${action}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ follower: loggedInUsername, following: username }),
        }
      );
      if (!res.ok) throw new Error(`Failed to ${action}`);
      const nowFollowing = !isFollowing;
      setIsFollowing(nowFollowing);
      setFollowStatus(nowFollowing ? 'Following' : 'Follow');
      window.dispatchEvent(new Event('followChanged'));
    } catch (err) {
      console.error(err);
      setFollowStatus('Error');
    }
  };

  return (
    <li className="flex gap-16 items-center justify-between text-base">
      <div className="flex gap-4 items-center">
        <img
          src={profilePic ?? '/sample-profile/dino2.jpg'}
          alt={username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <Link href={`/profile?username=${username}`}> 
          <span className="hover:underline cursor-pointer">{username}</span>
        </Link>
      </div>
      <div className="w-[100px] flex justify-end">
        {loggedInUsername && loggedInUsername !== username ? (
          <button
            onClick={handleToggle}
            className={`w-[100px] text-center px-4 rounded cursor-pointer border-2 border-[var(--primary-pink)] transition-all
              ${
                isFollowing
                  ? 'bg-white text-red-500 hover:bg-red-100'
                  : 'bg-[var(--primary-pink)] text-white hover:bg-[var(--bright-pink)]'
              }`}
          >
            {followStatus}
          </button>
        ) : (
          <div className="min-w-[80px]" />
        )}
      </div>
    </li>
  );
};

// Main user list component
const UserList: React.FC<UserListProps> = ({
  users,
  title = 'Users',
  onClose,
}) => {
  const [profilePics, setProfilePics] = useState<Record<string, string>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const loggedInUsername =
    typeof window !== 'undefined' ? sessionStorage.getItem('username') : null;

  useEffect(() => {
    // 1) Fetch all profile pics
    users.forEach(async (u) => {
      try {
        const res = await fetch(
          `http://localhost:${BACKEND_PORT}/api/users/profile?username=${u}`
        );
        if (res.ok) {
          const data = await res.json();
          setProfilePics((prev) => ({ ...prev, [u]: data.photo }));
        }
      } catch (err) {
        console.error('Profile pic fetch error:', err);
      }
    });
    // 2) Fetch my following list once
    if (loggedInUsername) {
      fetch(
        `http://localhost:${BACKEND_PORT}/api/users/following?username=${loggedInUsername}`
      )
        .then((res) => res.json())
        .then((list: string[]) => {
          const map: Record<string, boolean> = {};
          users.forEach((u) => (map[u] = list.includes(u)));
          setFollowingMap(map);
        })
        .catch((err) => console.error('Follow list fetch error:', err));
    }
  }, [users, loggedInUsername]);

  return (
    <Modal onClose={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md overflow-hidden">
        <div className="flex gap-8 justify-between items-center border-b p-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        <ul className="max-h-96 overflow-y-auto flex flex-col gap-4 p-4">
            {users.length > 0 ? (
            users.map((u) => (
              <UserCard
              key={u}
              username={u}
              profilePic={profilePics[u]}
              initialFollowing={!!followingMap[u]}
              loggedInUsername={loggedInUsername}
              />
            ))
            ) : (
            <div className="text-center text-gray-500 px-16">No users found</div>
            )}
        </ul>
      </div>
    </Modal>
  );
};

export default UserList;
