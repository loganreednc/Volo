import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileImagePreview, setProfileImagePreview] = useState("");

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
        setProfileImagePreview(data.user.profileImage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, profileImage: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user.firstName || !user.lastName || !user.city || !user.state || !user.birthdate || !user.gender) {
      setError("All fields are required");
      return;
    }

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

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="loader"></div></div>;

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
          {profileImagePreview && (
            <div className="flex justify-center mt-4">
              <Image src={profileImagePreview} alt="Profile Preview" width={100} height={100} className="rounded-full" />
            </div>
          )}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">Update Profile</button>
        </form>
      </div>
    </div>
  );
}