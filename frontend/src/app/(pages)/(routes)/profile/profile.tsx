"use client";
import React, { useState, useEffect } from 'react';
import Feed from '@/components/feed'
import { useSearchParams } from 'next/navigation';

const Profile = () => {
  const searchParams = useSearchParams();
const [profileUsername, setProfileUsername] = useState("");
useEffect(() => {
  const queryUsername = searchParams.get("username");
  // Check if window is defined before accessing sessionStorage
  const storedUsername = typeof window !== "undefined" ? sessionStorage.getItem("username") : "";
  setProfileUsername(queryUsername || storedUsername || "");
}, [searchParams]);

  const [loggedInUser, setLoggedInUser] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setLoggedInUser(storedUsername);
      // Fetch following list for logged-in user to set follow status
      fetch(`http://localhost:5000/api/users/following?username=${storedUsername}`)
        .then(res => res.json())
        .then((followingList: string[]) => {
          if (followingList.includes(profileUsername)) {
            setIsFollowing(true);
            setFollowStatus("Following");
          } else {
            setIsFollowing(false);
            setFollowStatus("Follow");
          }
        })
        .catch(err => console.error(err));
    }
  }, [profileUsername]);

  const handleFollowToggle = async () => {
    console.log("Unfollow payload:", { follower: loggedInUser, following: profileUsername });
    try {
      if (isFollowing) {
        // Call unfollow endpoint
        const res = await fetch("http://localhost:5000/api/users/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follower: loggedInUser,
            following: profileUsername
          })
        });
        if (!res.ok) throw new Error("Failed to unfollow user");
        setIsFollowing(false);
        setFollowStatus("Follow");
      } else {
        // Call follow endpoint
        const res = await fetch("http://localhost:5000/api/users/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            follower: loggedInUser,
            following: profileUsername
          })
        });
        if (!res.ok) throw new Error("Failed to follow user");
        setIsFollowing(true);
        setFollowStatus("Following");
      }
    } catch (error) {
      console.error(error);
      setFollowStatus("Error");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent p-4">
      <img 
        src="/sample-profile/dino1.jpg" 
        alt="Profile" 
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
      />
      <h1 className="mt-4 text-2xl font-bold text-gray-800">{profileUsername}</h1>
      {loggedInUser && loggedInUser !== profileUsername && (
        <button 
          onClick={handleFollowToggle}
          className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] hover:cursor-pointer mt-2"
        >
          {followStatus}
        </button>
      )}
      <p className="mt-2 mb-6 text-center text-gray-600 max-w-md">
        This is {profileUsername}'s profile page.
      </p>
      {/* If the logged in user is viewing their own profile, pass filterBy="mine" */}
      {loggedInUser === profileUsername ? (
        <Feed className='w-full' filterBy="mine" />
      ) : (
        <Feed className='w-full' filterByUser={profileUsername} />
      )}
    </div>
  );
};

export default Profile;
