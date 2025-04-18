"use client";
import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,      // sending email (not username) to the backend
          password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error || "Login failed");
        setShowErrorModal(true);
        return;
      }
      const data = await res.json();
      // Store the returned username (from the database) for further use.
      sessionStorage.setItem("username", data.user.username);
      sessionStorage.setItem("role", data.user.role);
      console.log("Logged in with username:", data.user.username);
      // Redirect based on user role: admin goes to /admin, others to /profile
      if (data.user.role === "admin") {
        window.location.href = '/admin';
      } else {
        window.location.href = '/profile';
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Login error");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen flex justify-center">
      <div className="w-full max-w-md p-8 h-min items-center border-2 border-[var(--primary-pink)] justify-center bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-[var(--dark-color)]">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-[var(--dark-color)]">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-[var(--dark-color)] mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border-[var(--primary-pink)] bg-[var(--verylight-pink)] text-[var(--dark-color)] rounded focus:outline-none focus:ring focus:border-[var(--primary-pink)]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[var(--primary-pink)] text-white py-2 px-4 rounded hover:bg-[var(--bright-pink)] transition duration-200"
          >
            Login
          </button>
          <p className="text-center mt-4 text-[var(--dark-color)]">
            Don't have an account? <a href="/sign-up" className="font-bold text-[var(--primary-pink)]">Sign up</a>
          </p>
        </form>
      </div>
      {/* Error Modal (styled exactly like Header's logout modal) */}
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
    </div>
  );
};

export default Login;
