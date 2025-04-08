"use client";
import React, { useState, useEffect, useRef } from 'react';
import Feed from '@/components/feed';
import { useSearchParams } from 'next/navigation';
import { MdOutlineModeEdit } from "react-icons/md";

const Profile = () => {
  const searchParams = useSearchParams();
  const [profileUsername, setProfileUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set profile username from query or session storage
  useEffect(() => {
    const queryUsername = searchParams.get("username");
    const storedUsername = typeof window !== "undefined" ? sessionStorage.getItem("username") : "";
    setProfileUsername(queryUsername || storedUsername || "");
  }, [searchParams]);

  // Fetch profile data from the backend
  useEffect(() => {
    if (profileUsername) {
      fetch(`http://localhost:5000/api/users/profile?username=${profileUsername}`)
        .then(res => res.json())
        .then(data => {
          if (data.photo) {
            // Ensure the backslash is replaced with a forward slash.
            setProfilePic(data.photo.replace(/\\/g, '/'));
          }
          // Optionally, also set the bio or other details:
          if(data.bio) {
            setBio(data.bio);
          }
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [profileUsername]);

  // Following functionalities retained from your existing code...
  const [loggedInUser, setLoggedInUser] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setLoggedInUser(storedUsername);
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

  const handleProfilePicChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('username', loggedInUser || profileUsername);
    formData.append('profilePic', file);

    try {
      const res = await fetch("http://localhost:5000/api/users/uploadProfilePicture", {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Profile picture upload failed");
      const data = await res.json();
      // Update the profile picture with the newly returned photo link
      setProfilePic(data.photo.replace(/\\/g, '/'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        const res = await fetch("http://localhost:5000/api/users/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower: loggedInUser, following: profileUsername })
        });
        if (!res.ok) throw new Error("Failed to unfollow user");
        setIsFollowing(false);
        setFollowStatus("Follow");
      } else {
        const res = await fetch("http://localhost:5000/api/users/follow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower: loggedInUser, following: profileUsername })
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
      <div className="relative inline-block">
        <img 
          // Prepend "/" to the relative path to access the file
          src={profilePic ? `http://localhost:5000/${profilePic.replace(/\\/g, '/')}` : "/sample-profile/dino2.jpg"}
          alt="Profile" 
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
        {loggedInUser === profileUsername && (
          <>
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-0 right-0 bg-[var(--primary-pink)] rounded-full p-1 cursor-pointer"
            >
              <span className="text-white text-xs"><MdOutlineModeEdit /></span>
            </button>
            <input 
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </>
        )}
      </div>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">{profileUsername}</h1>
      {bio && <p className="text-gray-600 mt-2">{bio}</p>}
      {loggedInUser && loggedInUser !== profileUsername && (
        <button 
          onClick={handleFollowToggle}
          className={`px-4 py-2 rounded hover:cursor-pointer mt-2 border border-2 border-[var(--primary-pink)] ${
            isFollowing 
              ? "bg-white text-red-500 hover:bg-red-100" 
              : "bg-[var(--primary-pink)] text-white hover:bg-[var(--bright-pink)]"
          }`}
        >
          {followStatus}
        </button>
      )}
      <p className="mt-2 mb-6 text-center text-gray-600 max-w-md">
        This is {profileUsername}'s profile page.
      </p>
      {loggedInUser === profileUsername ? (
        <Feed className='w-full' filterBy="mine" />
      ) : (
        <Feed className='w-full' filterByUser={profileUsername} />
      )}
    </div>
  );
};

export default Profile;
