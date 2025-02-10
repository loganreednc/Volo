// pages/admin.js
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken");
        const res = await fetch("/api/candidates", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load candidates");
        const data = await res.json();
        setCandidates(data.candidates || []);
      } catch (err) {
        console.error("❌ Fetch Candidates Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

        {/* Candidates List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold">All Candidates</h2>
          {candidates.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {candidates.map((candidate) => (
                <li key={candidate.email} className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="text-lg font-medium">
                    {candidate.firstName} {candidate.lastName} ({candidate.gender})
                  </p>
                  <p className="text-sm text-gray-600">{candidate.city}, {candidate.state}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No candidates found.</p>
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
