// pages/login.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const storedProfile = localStorage.getItem('profile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      if (profile.name.toLowerCase() === name.toLowerCase()) {
        router.push('/dashboard'); // If the name matches, go to Dashboard.
      } else {
        alert('Name does not match our records. Please sign up first.');
      }
    } else {
      alert('No profile found. Please sign up first.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded mt-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Log In</h1>
      <form onSubmit={handleLogin}>
        <label className="block font-semibold mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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


