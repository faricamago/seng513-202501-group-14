'use client';
import { BACKEND_PORT } from '@/common/global-vars';
import React, { useState } from 'react';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [result, setResult] = useState('');

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult("");

    if (password !== confirmPassword) {
      setResult("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      setResult("Account created successfully! Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err: any) {
      setResult(err.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md h-min p-8 border-2 border-[var(--primary-pink)] bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--dark-color)]">New Account</h2>
        {result && <p className="text-black text-center mb-4">{result}</p>}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-[var(--dark-color)]">Username</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"/>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[var(--dark-color)]">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"/>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-[var(--dark-color)]">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"/>
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-[var(--dark-color)]">Confirm Password</label>
            <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"/>
          </div>
          <button type="submit" className="w-full bg-[var(--primary-pink)] text-white py-2 px-4 rounded hover:bg-[var(--bright-pink)] transition duration-200">Create Account</button>
          <p className="text-center mt-4 text-[var(--dark-color)]">Already have an account? <a href="/login" className="font-bold text-[var(--primary-pink)]">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;