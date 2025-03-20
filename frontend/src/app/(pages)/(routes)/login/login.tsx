"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem('username', username);
    console.log('Logged in with username:', username);
    window.location.href= '/profile';
  };

  return (
    <div className="min-h-screen flex justify-center">
    <div className="w-full max-w-md p-8 h-min items-center border-2 border-[var(--primary-pink)] justify-center bg-white rounded shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
    <form onSubmit={handleLogin}>
        <div className="mb-4">
        <label htmlFor="username" className="block text-[var(--dark-color)]">Username</label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] rounded focus:outline-none focus:ring focus:border-text-[var(--primary-pink)]"/>
        </div>
        <div className="mb-6">
        <label htmlFor="password" className="block text-[var(--dark-color)] mb-2">Password</label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"/>
        </div>
        <button type="submit" className="w-full bg-[var(--primary-pink)] text-white py-2 px-4 rounded hover:bg-[var(--bright-pink)] transition duration-200">Login</button>
    </form>
    </div>
    </div>
  );
};

export default Login;
