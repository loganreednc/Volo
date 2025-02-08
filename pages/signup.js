// pages/signup.js
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { useRouter } from "next/router";

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [instagram, setInstagram] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    let photoURL = "";

    if (profilePic) {
      const reader = new FileReader();
      reader.readAsDataURL(profilePic);
      reader.onload = () => {
        photoURL = reader.result;
      };
    }

    const res = await fetch("/api/candidates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        age,
        gender,
        location: { city, state: stateLoc },
        email,
        password,
        instagram,
        photoURL
      }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      setError("Error creating profile. Email may already be in use.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Sign Up</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label className="block font-medium mb-1">First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border p-2 rounded w-full mb-3" required />

        <label className="block font-medium mb-1">Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="border p-2 rounded w-full mb-3" required />

        <label className="block font-medium mb-1">Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded w-full mb-3" required />

        <label className="block font-medium mb-1">Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 rounded w-full mb-3" required />

        <label className="block font-medium mb-1">Confirm Password:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border p-2 rounded w-full mb-3" required />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600" disabled={loading}>
          {loading ? "Creating Profile..." : "Create Profile"}
        </button>
      </form>
    </div>
  );
}






