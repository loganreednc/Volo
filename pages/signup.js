// pages/signup.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState(''); // "male" or "female"
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePic, setProfilePic] = useState(null); // This will hold the file

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple password check:
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Create a candidate profile object (admin fields like email and instagram are stored, but later made admin-only)
    const profile = {
      firstName,
      lastName,
      age,
      gender,
      location: { city, state },
      email,
      password, // In a real app, password should be hashed on the server side
      instagram,
      // We'll handle file uploads separately; for now, store the file name or URL placeholder.
      photoURL: profilePic ? URL.createObjectURL(profilePic) : null,
    };
    // Save profile to localStorage for now (in production, you'd send this to your API)
    localStorage.setItem('profile', JSON.stringify(profile));
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-4">
      <h1 className="text-xl font-bold mb-4 text-blue-900">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Age:</label>
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Gender:</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <label className="block font-medium mb-1">City:</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">State:</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Upload Profile Picture:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="border p-2 rounded w-full mb-3"
          required
        />
        <label className="block font-medium mb-1">Instagram Handle:</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          className="border p-2 rounded w-full mb-4"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Profile
        </button>
      </form>
    </div>
  );
}



