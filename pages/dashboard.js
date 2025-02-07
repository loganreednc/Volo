// pages/dashboard.js
import { useState, useEffect } from 'react';

export default function Dashboard() {
  // For this demo, we assume the candidate’s ID is stored in localStorage.
  // In a real application, you would use proper authentication.
  const candidateId = localStorage.getItem('candidateId');
  const [proposals, setProposals] = useState([]);

  // Fetch match proposals for this candidate when the component loads
  useEffect(() => {
    if (candidateId) {
      fetch(`/api/match-proposals?candidateId=${candidateId}`)
        .then((res) => res.json())
        .then((data) => setProposals(data))
        .catch((err) => console.error(err));
    }
  }, [candidateId]);

  const handleResponse = async (proposalId, candidate, approved) => {
    await fetch('/api/match-proposals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proposalId, candidate, approved }),
    });
    // Refresh proposals after response
    const res = await fetch(`/api/match-proposals?candidateId=${candidateId}`);
    const data = await res.json();
    setProposals(data);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Match Proposals</h1>
      {proposals.length === 0 ? (
        <p>No match proposals yet.</p>
      ) : (
        proposals.map((proposal) => (
          <div key={proposal._id} className="border p-4 rounded mb-4">
            <h2 className="text-xl font-semibold mb-2">
              {proposal.candidateA._id === candidateId
                ? proposal.candidateB.name
                : proposal.candidateA.name}
            </h2>
            <p>Status: {proposal.status}</p>
            {proposal.status === 'Pending' && (
              <div className="mt-2">
                <button
                  onClick={() =>
                    handleResponse(
                      proposal._id,
                      proposal.candidateA._id === candidateId ? 'A' : 'B',
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
                      proposal.candidateA._id === candidateId ? 'A' : 'B',
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
    </div>
  );
}


