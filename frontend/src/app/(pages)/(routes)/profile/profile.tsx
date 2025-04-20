// src/pages/profile.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Feed from '@/components/feed';
import { NotificationBell } from '@/components/notificationBell';
import { useSearchParams } from 'next/navigation';
import { MdOutlineModeEdit } from "react-icons/md";
import { BACKEND_PORT } from "@/common/global-vars";
import UserList from "@/components/userList";

const Profile = () => {
  const searchParams = useSearchParams();
  const [profileUsername, setProfileUsername] = useState<string>("");
  const [profilePic, setProfilePic] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const [showModalType, setShowModalType] = useState<"followers" | "following" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // current logged-in user
  const me = typeof window !== "undefined" ? sessionStorage.getItem("username") : "";

  // 1) Determine which profile to show
  useEffect(() => {
    const queryUsername = searchParams.get("username");
    const loggedInUsername = typeof window !== "undefined" ? sessionStorage.getItem("username") : "";
    setProfileUsername(queryUsername || loggedInUsername || "");
  }, [searchParams]);

  useEffect(() => {
    if (profileUsername) {
      fetch( `http://localhost:5000/api/users/profile?username=${encodeURIComponent(profileUsername)}`)
        .then(res => res.json())
        .then(data => {
          if (data.photo) setProfilePic(data.photo);
          if (data.bio) setBio(data.bio);
        })
        .catch(err => console.error("Error fetching profile:", err));
    }
  }, [profileUsername]);

  // 2) Fetch profile picture & bio
  useEffect(() => {
    if (!profileUsername) return;
    fetch(
      `http://localhost:${BACKEND_PORT}/api/users/profile?username=${profileUsername}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.photo) setProfilePic(data.photo);
        if (data.bio) setBio(data.bio);
      })
      .catch((err) => console.error(err));
  }, [profileUsername]);

  // 3) Central reload of follow data
  const reloadFollowData = useCallback(async () => {
    if (!profileUsername) return;
    try {
      // a) Who follows *this* profile?
      const fRes = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/followers?username=${profileUsername}`
      );
      if (fRes.ok) {
        const arr: string[] = await fRes.json();
        setFollowers(arr);
      }

      // b) Who does *this* profile follow? (for "Following" count)
      const gRes = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/following?username=${profileUsername}`
      );
      if (gRes.ok) {
        const arr: string[] = await gRes.json();
        setFollowing(arr);
      }

      // c) Do I follow *this* profile?
      if (me) {
        const myRes = await fetch(
          `http://localhost:${BACKEND_PORT}/api/users/following?username=${me}`
        );
        if (myRes.ok) {
          const myArr: string[] = await myRes.json();
          setIsFollowing(myArr.includes(profileUsername));
        }
      }
    } catch (err) {
      console.error("reloadFollowData error", err);
    }
  }, [profileUsername, me]);

  // initial load & on followChanged event
  useEffect(() => {
    reloadFollowData();
  }, [reloadFollowData]);

  useEffect(() => {
    const handler = () => reloadFollowData();
    window.addEventListener("followChanged", handler);
    return () => window.removeEventListener("followChanged", handler);
  }, [reloadFollowData]);

  // 4) Toggle follow/unfollow on this profile
  const handleProfileFollowToggle = async () => {
    if (!me) return;
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ follower: me, following: profileUsername }),
        }
      );
      if (!res.ok) throw new Error("toggle failed");
      // emit global event to refresh all follow data
      window.dispatchEvent(new Event("followChanged"));
    } catch (err) {
      console.error(err);
    }
  };

  // 5) Profile-pic upload
  const handleProfilePicChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.[0]) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("username", me || profileUsername);
    formData.append("profilePic", file);
    try {
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/uploadProfilePicture`,
        { method: "POST", body: formData }
      );
      if (!res.ok) throw new Error("upload failed");
      const data = await res.json();
      setProfilePic(data.photo);
    } catch (err) {
      console.error(err);
    }
  };

  // 6) Bio edit handlers
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
      const res = await fetch(
        `http://localhost:${BACKEND_PORT}/api/users/updateBio`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: profileUsername, bio: newBio }),
        }
      );
      if (!res.ok) throw new Error("save failed");
      setBio(newBio);
      setIsEditingBio(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 7) Render
  return (
    <div className="flex flex-col items-center min-h-screen bg-transparent p-4">
      <div className="absolute top-4 right-4">
        <NotificationBell />
      </div>
      <div className="relative inline-block">
        <img
          src={profilePic || "/sample-profile/dino2.jpg"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
        />
        {me === profileUsername && (
          <>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-0 right-0 bg-[var(--primary-pink)] rounded-full p-1 cursor-pointer"
            >
              <MdOutlineModeEdit className="text-white text-xs" />
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

      {/* Username */}
      <h1 className="mt-4 text-2xl font-bold text-gray-800">
        {profileUsername}
      </h1>

      {/* Follower/Following counts */}
      <div className="flex gap-6 text-gray-700 font-semibold mt-2">
        <div
          className="cursor-pointer hover:underline"
          onClick={() => setShowModalType("followers")}
        >
          {followers.length} Followers
        </div>
        <div
          className="cursor-pointer hover:underline"
          onClick={() => setShowModalType("following")}
        >
          {following.length} Following
        </div>
      </div>

      {/* Follow/Unfollow button */}
      {me && me !== profileUsername && (
        <button
          onClick={handleProfileFollowToggle}
          className={`px-4 py-2 mt-4 rounded border-2 border-[var(--primary-pink)] ${
            isFollowing
              ? "bg-white text-red-500 hover:bg-red-100"
              : "bg-[var(--primary-pink)] text-white hover:bg-[var(--bright-pink)]"
          }`}>
          {isFollowing ? "Following" : "Follow"}
        </button>
      )}

      {/* Bio */}
      <div className="mt-4 mb-6 w-full max-w-md text-gray-600 text-center">
        {me === profileUsername ?
          isEditingBio ? (
            <div>
              <textarea
                className="border p-2 w-full"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <div className="flex justify-center gap-4 p-4">
                <button onClick={handleCancelBio} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSaveBio} className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded">Save</button>
              </div>
            </div>
          ) : (
            <p onClick={() => { setNewBio(bio); setIsEditingBio(true); }}>
              {bio || "Click to add bio."}
            </p>
          )
        :
          <p>{bio}</p>
        }
      </div>

      {/* Feed */}
      {me === profileUsername ? (
        <Feed className="w-full" filterBy="mine" />
      ) : (
        <Feed className="w-full" filterByUser={profileUsername} />
      )}

      {/* Error modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="bg-white p-6 rounded-lg">
            <p>{errorMessage}</p>
            <button onClick={() => setShowErrorModal(false)}>OK</button>
          </div>
        </div>
      )}

      {/* Popup */}
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
