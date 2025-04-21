"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MdOutlineModeEdit,  MdDeleteOutline} from "react-icons/md";
import { GiDinosaurRex } from "react-icons/gi";
import { BACKEND_PORT } from "@/common/global-vars";
import { CommentType } from "./post";

interface Props {
  postId: string;
  initialComments: CommentType[];
  onCommentsChanged: (list: CommentType[]) => void;
}

const CommentSection: React.FC<Props> = ({
  postId,
  initialComments,
  onCommentsChanged,
}) => {
  const me = typeof window !== "undefined"
    ? sessionStorage.getItem("username")
    : "";

  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [avatars,  setAvatars]  = useState<Record<string, string>>({});
  const [newText, setNewText]   = useState("");
  const [editId, setEditId]     = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  /* ---------- login‑modal state (same pattern as Footer) ---------- */
  const [showLoginModal, setShowLoginModal] = useState(false);

  const goToLogin = () => {
    setShowLoginModal(false);
    window.location.href = "/login";
  };

  /* ---------- helpers ---------- */
  const syncState = (list: CommentType[]) => {
    setComments(list);
    onCommentsChanged(list);
  };

  /* ---------- CRUD ---------- */
  const addComment = async () => {
    if (!me) { setShowLoginModal(true); return; }
    if (!newText.trim()) return;

    const res = await fetch(
      `http://localhost:${BACKEND_PORT}/api/posts/${postId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: me, content: newText.trim() }),
      }
    );
    if (!res.ok) return;
    const { post } = await res.json();
    setNewText("");
    syncState(post.comments);
  };

  const updateComment = async (commentId: string) => {
    if (!editText.trim()) return;
    const res = await fetch(
      `http://localhost:${BACKEND_PORT}/api/posts/${postId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: me, content: editText.trim() }),
      }
    );
    if (!res.ok) return;
    const { post } = await res.json();
    setEditId(null);
    syncState(post.comments);
  };

  const deleteComment = async (commentId: string) => {
    const res = await fetch(
      `http://localhost:${BACKEND_PORT}/api/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: me }),
      }
    );
    if (!res.ok) return;
    const { post } = await res.json();
    syncState(post.comments);
  };

  /* fetch current photos for all unique commenters */
    useEffect(() => {
        (async () => {
        const need: string[] = [];
        comments.forEach(c => {
            if (!avatars[c.username]) need.push(c.username);
        });
        await Promise.all(
            Array.from(new Set(need)).map(async (u) => {
            const res = await fetch(
                `http://localhost:${BACKEND_PORT}/api/users/profile?username=${u}`
            );
            if (res.ok) {
                const { photo } = await res.json();
                setAvatars((prev) => ({ ...prev, [u]: photo || "" }));
            }
            })
        );
        })();
    }, [comments]);

    useEffect(() => {
        const handler = (e: any) => {
          const { username, photo } = e.detail || {};
          if (!username) return;
          setAvatars((prev) => ({ ...prev, [username]: photo || "" }));
        };
        window.addEventListener("profilePicUpdated", handler);
        return () => window.removeEventListener("profilePicUpdated", handler);
      }, []);
      

  /* ---------- UI ---------- */
  return (
    <div className="px-6 pb-4 mt-2 space-y-4">

      {/* existing comments */}
      {comments.map((c) => (
        <div key={c._id} className="flex gap-3 text-sm">
          {/* avatar */}
          <Link href={`/profile?username=${c.username}`}>
            {(avatars[c.username] || c.photo) ? (
              <img
                src={avatars[c.username] || c.photo}
                alt={c.username}
                className="w-8 h-8 rounded-full object-cover border"
              />
            ) : (
                <GiDinosaurRex
                className="w-full h-full text-[var(--verylight-pink)] rounded-full"
             />
            )}
          </Link>

          {/* body */}
          <div className="flex-1">
            <Link
              href={`/profile?username=${c.username}`}
              className="font-semibold hover:underline"
            >
              {c.username}
            </Link>

            {editId === c._id ? (
              <div className="flex flex-col gap-1">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border w-full rounded p-1 text-xs"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateComment(c._id)}
                    className="text-xs px-2 py-1 bg-[var(--primary-pink)] text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-line">{c.content}</p>
            )}
          </div>

          {/* author controls */}
          {me === c.username && editId !== c._id && (
            <div className="flex gap-1 text-lg mt-1">
              <button className="text-gray-500 hover:text-blue-500 transition text-2xl"
                onClick={() => {
                  setEditId(c._id);
                  setEditText(c.content);
                }}
              >
                <MdOutlineModeEdit />
              </button>
              <button className="text-gray-500 hover:text-blue-500 transition text-2xl"
                onClick={() => deleteComment(c._id)}>
                <MdDeleteOutline />
              </button>
            </div>
          )}
        </div>
      ))}

      {/* add‑new or login prompt */}
      <div className="flex gap-2">
            <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a comment…"
            rows={1}
            className="flex-1 border rounded p-2 text-sm resize-none"
            />
            <button
            onClick={addComment}              
            className="px-3 py-1 bg-[var(--uoc-yellow)] rounded disabled:opacity-40"
            disabled={!newText.trim()}
            >
            Post
            </button>
        </div>

      {/* -------- login modal -------- */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto transform transition-all duration-300 hover:scale-105">
            <h2 className="text-[var(--dark-color)] text-2xl font-bold text-center mb-4">
              Please Login
            </h2>
            <p className="text-gray-700 text-center mb-6">
              You must be logged in to write comments.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-300 text-[var(--dark-color)] rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={goToLogin}
                className="px-4 py-2 bg-[var(--primary-pink)] text-white rounded hover:bg-[var(--bright-pink)] transition"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
