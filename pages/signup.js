// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [interests, setInterests] = useState('');
  const [instagram, setInstagram] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const profile = { name, age, interests, instagram };
    localStorage.setItem('profile', JSON.stringify(profile));
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className="block font-semibold mb-1">Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
          required
        />
        <label className="block font-semibold mb-1">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
          required
        />
        <label className="block font-semibold mb-1">Interests:</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
          required
        />
        <label className="block font-semibold mb-1">Instagram Handle:</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-6"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}


