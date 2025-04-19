"use client";
import React, { useState, useEffect, useRef } from 'react';
import Feed from '@/components/feed';
import { useSearchParams } from 'next/navigation';
import { MdOutlineModeEdit } from "react-icons/md";
import { BACKEND_PORT } from '@/common/global-vars';
import UserList from '@/components/userList';

const Profile = () => {
  const searchParams = useSearchParams();
  const [profileUsername, setProfileUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [bio, setBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loggedInUser, setLoggedInUser] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState("");

  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [showModalType, setShowModalType] = useState<"followers" | "following" | null>(null);

  useEffect(() => {
    const queryUsername = searchParams.get("username");
    const loggedInUsername = typeof window !== "undefined" ? sessionStorage.getItem("username") : "";
    setProfileUsername(queryUsername || loggedInUsername || "");
  }, [searchParams]);

  useEffect(() => {
    if (profileUsername) {
      fetch(`http://localhost:${BACKEND_PORT}/api/users/profile?username=${profileUsername}`)
        .then(res => res.json())
        .then(data => {
          if (data.photo) setProfilePic(data.photo);
          if (data.bio) setBio(data.bio);
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [profileUsername]);

  useEffect(() => {
    if (!profileUsername) return;
  
    const fetchData = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`http://localhost:${BACKEND_PORT}/api/users/followers?username=${profileUsername}`),
          fetch(`http://localhost:${BACKEND_PORT}/api/users/following?username=${profileUsername}`)
        ]);
  
        if (followersRes.ok) {
          const followerList: string[] = await followersRes.json();
          setFollowers(followerList);
        }
  
        if (followingRes.ok) {
          const followingList: string[] = await followingRes.json();
          setFollowing(followingList);
        }
      } catch (err) {
        console.error("Error fetching follow data:", err);
      }
    };
  
    fetchData();
  }, [profileUsername]);
  

  useEffect(() => {
    const loggedInUsername = sessionStorage.getItem('username');
    if (loggedInUsername) {
      setLoggedInUser(loggedInUsername);
      fetch(`http://localhost:${BACKEND_PORT}/api/users/following?username=${loggedInUsername}`)
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
      const res = await fetch(`http://localhost:${BACKEND_PORT}/api/users/uploadProfilePicture`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Profile picture upload failed");
      const data = await res.json();
      setProfilePic(data.photo);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelBio = () => {
    setNewBio(bio);
    setIsEditingBio(false);
  };

  const handleSaveBio = async () => {
    if (!newBio.trim()) {
      setErrorMessage("Bio cannot be empty.");
      setShowErrorModal(true);
      return;
    }
    try {
      const res = await fetch(`http://localhost:${BACKEND_PORT}/api/users/updateBio`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: profileUsername, bio: newBio })
      });
      if (!res.ok) throw new Error("Failed to update bio");
      setBio(newBio);
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing ? "unfollow" : "follow";
      const res = await fetch(`http://localhost:${BACKEND_PORT}/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ follower: loggedInUser, following: profileUsername })
      });
      if (!res.ok) throw new Error("Follow/unfollow failed");
      setIsFollowing(!isFollowing);
      setFollowStatus(!isFollowing ? "Following" : "Follow");
    } catch (error) {
      console.error(error);
      setFollowStatus("Error");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent p-4">
      <div className="relative inline-block">
        <img 
          src={profilePic ? profilePic : "/sample-profile/dino2.jpg"}
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

      <div className="flex gap-6 text-gray-700 text-base font-semibold mt-2">
        <div className="cursor-pointer hover:underline" onClick={() => setShowModalType("followers")}>
          {followers.length} Followers
        </div>
        <div className="cursor-pointer hover:underline" onClick={() => setShowModalType("following")}>
          {following.length} Following
        </div>
      </div>

      <div className="mt-2 mb-4">
        {loggedInUser === profileUsername ? (
          isEditingBio ? (
            <div>
              <textarea
                className="border p-2 w-full"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <div className="flex justify-center space-x-4 p-4">
                <button onClick={handleCancelBio} className="px-4 py-2 text-[var(--dark-color)] bg-gray-300 rounded hover:bg-gray-400 hover:cursor-pointer w-1/2">
                  Cancel
                </button>
                <button onClick={handleSaveBio} className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] hover:cursor-pointer w-1/2">
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className='relative group'>
              <p className="text-gray-600 cursor-pointer" onClick={() => { setNewBio(bio); setIsEditingBio(true); }}>
                {bio}
              </p>
              <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Click to edit bio.
              </span>
            </div>
          )
        ) : (
          <p className="text-gray-600">{bio}</p>
        )}
      </div>

      {loggedInUser && loggedInUser !== profileUsername && (
        <button 
          onClick={handleFollowToggle}
          className={`px-4 py-2 mb-4 rounded hover:cursor-pointer mt-2 border border-2 border-[var(--primary-pink)] ${
            isFollowing 
              ? "bg-white text-red-500 hover:bg-red-100" 
              : "bg-[var(--primary-pink)] text-white hover:bg-[var(--bright-pink)]"
          }`}
        >
          {followStatus}
        </button>
      )}

      {loggedInUser === profileUsername ? (
        <Feed className='w-full' filterBy="mine" />
      ) : (
        <Feed className='w-full' filterByUser={profileUsername} />
      )}

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Error
            </h2>
            <p className="text-gray-700 text-center mb-6">
              {errorMessage}
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowErrorModal(false)}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalType && (
        <UserList
          title={showModalType === "followers" ? "Followers" : "Following"}
          users={showModalType === "followers" ? followers : following}
          onClose={() => setShowModalType(null)}
        />
      )}
    </div>
  );
};

export default Profile;
