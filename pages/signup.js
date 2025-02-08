// pages/signup.js
// Force the page to be rendered at request time (server-side)
export async function getServerSideProps(context) {
  return { props: {} };
}

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [stateLoc, setStateLoc] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to read a file as Base64
  const handleFileRead = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    let photoURL = "";
    if (profilePic) {
      try {
        photoURL = await handleFileRead(profilePic);
      } catch (error) {
        console.error("Error reading image file", error);
      }
    }
    const candidateData = {
      firstName,
      lastName,
      age,
      gender,
      location: { city, state: stateLoc },
      email,
      password, // In production, hash the password on the server side.
      instagram,
      photoURL,
    };

    // Save candidate to database via API
    const res = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candidateData),
    });
    if (res.ok) {
      const savedCandidate = await res.json();
      // Sanitize the saved candidate:
      const plainCandidate = JSON.parse(JSON.stringify(savedCandidate));
      localStorage.setItem('profile', JSON.stringify(plainCandidate));
      // Send welcome email via API
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: plainCandidate.email,
          subject: "Welcome to Volo!",
          text: `Hi ${plainCandidate.firstName},\n\nWelcome to Volo! Your account has been created. You can log in with your email (${plainCandidate.email}) and the password you set.\n\nThank you!`
        }),
      });
      setLoading(false);
      router.push('/dashboard');
    } else {
      setLoading(false);
      alert("Error creating profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Sign Up</h1>
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
          value={stateLoc}
          onChange={(e) => setStateLoc(e.target.value)}
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
          disabled={loading}
        >
          {loading ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
}





