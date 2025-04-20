// components/notificationBell.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { FaBell } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

interface Notification {
  _id: string;
  type: string;
  message: string;
  postId: string;
  title: string;
}

export const NotificationBell: React.FC = () => {
  const [notes, setNotes] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    setUser(sessionStorage.getItem('username'));
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch(`http://localhost:5000/api/notifications?username=${user}`)
      .then(res => res.json())
      .then(setNotes)
      .catch(console.error);
  }, [user]);

  const dismiss = async (id: string) => {
    await fetch('http://localhost:5000/api/notifications/read', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id })
      });
    setNotes(notes.filter(n => n._id !== id));
  };

  if (!notes.length) return null;
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)}>
        <FaBell className="text-3xl text-[var(--uoc-yellow)]" />
        <span className="absolute -top-1 -right-1 bg-[var(--primary-pink)] text-white text-xs rounded-full px-1">
          {notes.length}
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50">
          {notes.map(n => (
            <div key={n._id} className="p-3 border-b relative">
              <button
                onClick={()=>dismiss(n._id)}
                className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
              >
                <MdClose />
              </button>
              <p className="font-medium mt-2 ">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
