import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return router.push("/login");

      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setUser({ ...user, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("authToken");
    if (!token) return router.push("/login");

    const formData = new FormData();
    Object.keys(user).forEach((key) => formData.append(key, user[key]));

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      setSuccess("Profile updated successfully!");
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="firstName" value={user?.firstName || ""} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" />
          <input type="text" name="lastName" value={user?.lastName || ""} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" />
          <input type="text" name="city" value={user?.city || ""} onChange={handleChange} placeholder="City" className="w-full p-2 border rounded" />
          <input type="text" name="state" value={user?.state || ""} onChange={handleChange} placeholder="State" className="w-full p-2 border rounded" />
          <input type="date" name="birthdate" value={user?.birthdate || ""} onChange={handleChange} className="w-full p-2 border rounded" />
          <select name="gender" value={user?.gender || ""} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Update Profile</button>
        </form>
      </div>
    </div>
  );
}
