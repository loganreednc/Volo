// pages/dashboard.js
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  // State to hold the candidate's profile (retrieved from localStorage)
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);

  // Use useEffect to safely access localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        // Parse and set the candidate profile from localStorage
        setProfile(JSON.parse(storedProfile));
      }
    }
  }, []);

  // Once the profile is loaded, fetch match proposals using the candidate's _id
  useEffect(() => {
    if (profile && profile._id) {
      fetch(`/api/match-proposals?candidateId=${profile._id}`)
        .then((res) => res.json())
        .then((data) => setProposals(data))
        .catch((err) => console.error(err));
    } else if (profile) {
      // If no _id is found in the profile, set proposals to an empty array
      setProposals([]);
    }
  }, [profile]);

  // Handler to respond to a proposal (approve or pass)
  const handleResponse = async (proposalId, candidate, approved) => {
    await fetch('/api/match-proposals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, candidate, approved }),
    });
    // Refresh proposals after the response
    const res = await fetch(`/api/match-proposals?candidateId=${profile._id}`);
    const data = await res.json();
    setProposals(data);
  };

  // If the profile hasn't loaded yet, show a loading message
  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Match Proposals</h1>
      {proposals.length === 0 ? (
        <p>No match proposals yet.</p>
      ) : (
        proposals.map((proposal) => (
          <div key={proposal._id} className="border p-4 rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {proposal.candidateA._id === profile._id
                ? proposal.candidateB.firstName
                : proposal.candidateA.firstName}
            </h2>
            <p>Status: {proposal.status}</p>
            {proposal.status === 'Pending' && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    handleResponse(
                      proposal._id,
                      proposal.candidateA._id === profile._id ? 'A' : 'B',
                      true
                    )
                  }
                  className="bg-green-500 text-white py-1 px-3 rounded mr-2 hover:bg-green-600"
                >
                  Give Green Light
                </button>
                <button
                  onClick={() =>
                    handleResponse(
                      proposal._id,
                      proposal.candidateA._id === profile._id ? 'A' : 'B',
                      false
                    )
                  }
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Pass
                </button>
              </div>
            )}
          </div>
        ))
      )}
      <div className="mt-4">
        <Link
          href="/match"
          className="text-blue-500 hover:underline cursor-pointer"
        >
          View Match Proposal
        </Link>
      </div>
    </div>
  );
}


