// pages/dashboard.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No Auth Token Found! Redirecting...");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUser(data.user);
        setMatches(data.matches || []);
        setMessages(data.messages || []);
      } catch (err) {
        console.error("❌ Profile Fetch Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Function to calculate age from birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return "Not Provided";
    const birthYear = new Date(birthdate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const userAge = user?.age || calculateAge(user?.birthdate);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <img
            src={
              user?.profileImage && user.profileImage !== "null"
                ? user.profileImage.startsWith("/uploads/")
                  ? user.profileImage
                  : `/uploads/${user.profileImage}`
                : "/uploads/default-profile.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
            onError={(e) => (e.target.src = "/uploads/default-profile.png")}
          />
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
            <p className="text-gray-600">{user.city}, {user.state}</p>
            <p className="text-gray-700 text-sm">Age: {userAge}</p>
            <p className="text-gray-700 text-sm">Gender: {user.gender}</p>
            <button
              onClick={() => router.push("/edit-profile")}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Matches Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Your Matches</h2>
          {matches.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 mt-3">
              {matches.map((match) => (
                <div key={match.id} className="bg-gray-100 p-3 rounded-md">
                  <img
                    src={
                      match.profileImage && match.profileImage !== "null"
                        ? match.profileImage.startsWith("/uploads/")
                          ? match.profileImage
                          : `/uploads/${match.profileImage}`
                        : "/uploads/default-profile.png"
                    }
                    alt="Match"
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                    onError={(e) => (e.target.src = "/uploads/default-profile.png")}
                  />
                  <p className="text-center font-medium">
                    {match.firstName}, {calculateAge(match.birthdate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No matches yet. Coming soon!</p>
          )}
        </div>

        {/* Messages Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Messages</h2>
          {messages.length > 0 ? (
            <div className="mt-3 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-blue-100 p-3 rounded-md">
                  <p className="text-gray-800 font-semibold">{msg.senderName}:</p>
                  <p className="text-gray-700">{msg.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No messages yet.</p>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.removeItem("authToken");
              router.push("/login");
            }}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
