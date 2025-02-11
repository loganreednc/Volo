import { useEffect, useState } from "react";

export default function AdminMatching() {
  const [candidates, setCandidates] = useState([]);
  const [selected1, setSelected1] = useState("");
  const [selected2, setSelected2] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await fetch("/api/candidates");
        if (!res.ok) throw new Error("Failed to fetch candidates");
        const data = await res.json();
        setCandidates(data.candidates || []);
      } catch (err) {
        console.error("❌ Fetch Error:", err.message);
      }
    };

    fetchCandidates();
  }, []);

  const handleMatch = async () => {
    if (!selected1 || !selected2) {
      setMessage("❌ Please select two candidates");
      return;
    }

    try {
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate1Id: selected1, candidate2Id: selected2 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Match failed");

      setMessage("✅ Match created successfully!");
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Admin Matchmaking</h1>

      <div className="mt-4">
        <label className="block">Select Candidate 1:</label>
        <select value={selected1} onChange={(e) => setSelected1(e.target.value)} className="border p-2">
          <option value="">-- Select --</option>
          {candidates.map((c) => (
            <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block">Select Candidate 2:</label>
        <select value={selected2} onChange={(e) => setSelected2(e.target.value)} className="border p-2">
          <option value="">-- Select --</option>
          {candidates.map((c) => (
            <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
          ))}
        </select>
      </div>

      <button onClick={handleMatch} className="mt-4 bg-blue-600 text-white p-2 rounded">Create Match</button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}