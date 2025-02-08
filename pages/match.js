// pages/match.js
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Match() {
  const router = useRouter();
  const [proposal, setProposal] = useState(null);
  const [status, setStatus] = useState('Pending');

  // Load candidate profile from localStorage and create a fake match proposal
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      // Parse and sanitize candidateA from localStorage
      let candidateA = storedProfile ? JSON.parse(storedProfile) : null;
      if (candidateA) {
        candidateA = JSON.parse(JSON.stringify(candidateA));
      }
      // Create a fake candidateB with hardcoded details
      const candidateB = {
        firstName: 'Jane',
        lastName: 'Smith',
        age: 28,
        interests: 'Art, Community, Faith',
        instagram: '@jane_smith',
        photo: '/jane.jpg' // Ensure this image exists in your public folder or use a placeholder URL
      };
      // Create the fake proposal using sanitized candidateA and candidateB
      const fakeProposal = { candidateA, candidateB };
      setProposal(fakeProposal);
    }
  }, []);

  // If the proposal hasn't been set, show a loading message
  if (!proposal) {
    return <div className="p-4">Loading match proposal...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Match Proposal</h1>
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Potential Match: {proposal.candidateB.firstName} {proposal.candidateB.lastName}
        </h2>
        <p className="mb-1"><strong>Age:</strong> {proposal.candidateB.age}</p>
        <p className="mb-1"><strong>Interests:</strong> {proposal.candidateB.interests}</p>
        <img
          src={proposal.candidateB.photo || 'https://via.placeholder.com/150'}
          alt="Match"
          className="w-36 h-36 object-cover rounded"
        />
      </div>
      <div className="mb-4">
        <button
          onClick={() => setStatus('Approved')}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
        >
          Give Green Light
        </button>
        <button
          onClick={() => setStatus('Declined')}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Pass
        </button>
      </div>
      <p className="mb-4"><strong>Status:</strong> {status}</p>
      {status === 'Approved' && (
        <div className="border p-4 rounded border-green-500">
          <h2 className="text-xl font-semibold mb-2">Match Confirmed!</h2>
          <p className="mb-2">You can now view full details.</p>
          <p className="mb-2"><strong>Instagram:</strong> {proposal.candidateB.instagram}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
      {status === 'Declined' && (
        <div className="border p-4 rounded border-red-500">
          <h2 className="text-xl font-semibold mb-2">Match Declined</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}


