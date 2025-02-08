export const dynamic = 'force-dynamic';
// pages/login.js
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      if (
        profile.email.toLowerCase() === email.toLowerCase() &&
        profile.password === password
      ) {
        router.push('/dashboard');
      } else {
        alert('Email or password does not match our records. Please sign up first.');
      }
    } else {
      alert('No profile found. Please sign up first.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Log In</h1>
      <form onSubmit={handleLogin}>
        <label className="block font-semibold mb-1">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
          required
        />
        <label className="block font-semibold mb-1">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-6"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Log In
        </button>
      </form>
    </div>
  );
}



