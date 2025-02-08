// pages/login.js
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password
    });

    if (!result.error) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Log In</h1>
      {error && <p className="text-red-500">{error}</p>}
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
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full"
        >
          Log In
        </button>
      </form>
    </div>
  );
}




