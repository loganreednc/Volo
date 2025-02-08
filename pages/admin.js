// pages/admin.js
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Messaging from "../components/Messaging";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedMale, setSelectedMale] = useState("");
  const [selectedFemale, setSelectedFemale] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [matchProposals, setMatchProposals] = useState([]);

  useEffect(() => {
    fetchCandidates();
    fetchMatchProposals();
  }, []);

  const fetchCandidates = async () => {
    const res = await fetch("/api/candidates");
    const data = await res.json();
    setCandidates(data);
  };

  const fetchMatchProposals = async () => {
    const res = await fetch("/api/match-proposals");
    const data = await res.json();
    setMatchProposals(data);
  };

  const handleMatch = async () => {
    if (!selectedMale || !selectedFemale) {
      alert("Please select one male and one female candidate.");
      return;
    }

    const res = await fetch("/api/match-proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidateAId: selectedMale, candidateBId: selectedFemale }),
    });

    if (res.ok) {
      alert("Match proposal created successfully!");
      fetchMatchProposals();
    } else {
      alert("Error creating match proposal.");
    }
  };

  const handleApproval = async (proposalId, status) => {
    const res = await fetch("/api/match-proposals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposalId, status }),
    });

    if (res.ok) {
      fetchMatchProposals();
    } else {
      alert("Error updating match status.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Create Match Section */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Create Match Proposal</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-bold mb-2">Male Candidates</h3>
            <select className="border p-2 rounded w-full" value={selectedMale} onChange={(e) => setSelectedMale(e.target.value)}>
              <option value="">Select a male candidate</option>
              {candidates.filter((c) => c.gender === "male").map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.firstName} {candidate.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="font-bold mb-2">Female Candidates</h3>
            <select className="border p-2 rounded w-full" value={selectedFemale} onChange={(e) => setSelectedFemale(e.target.value)}>
              <option value="">Select a female candidate</option>
              {candidates.filter((c) => c.gender === "female").map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.firstName} {candidate.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button onClick={handleMatch} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Create Match Proposal
        </button>
      </div>

      {/* Match Approval Section */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Match Approvals</h2>
        {matchProposals.length === 0 ? (
          <p>No pending matches</p>
        ) : (
          matchProposals.map((proposal) => (
            <div key={proposal._id} className="border p-3 rounded mb-2">
              <p>
                <strong>{proposal.candidateA.firstName}</strong> & <strong>{proposal.candidateB.firstName}</strong>
              </p>
              <p>Status: {proposal.status}</p>
              {proposal.status === "Pending" && (
                <>
                  <button onClick={() => handleApproval(proposal._id, "Confirmed")} className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 mr-2">
                    Approve
                  </button>
                  <button onClick={() => handleApproval(proposal._id, "Declined")} className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600">
                    Reject
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Messaging Section */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Send Message to Candidate</h2>
        <select className="border p-2 rounded w-full mb-4" value={selectedCandidate} onChange={(e) => setSelectedCandidate(e.target.value)}>
          <option value="">Select a candidate</option>
          {candidates.map((candidate) => (
            <option key={candidate._id} value={candidate._id}>
              {candidate.firstName} {candidate.lastName}
            </option>
          ))}
        </select>
        {selectedCandidate && <Messaging candidateId={selectedCandidate} />}
      </div>
    </div>
  );
}






