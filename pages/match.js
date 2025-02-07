// pages/match.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Match() {
  const router = useRouter();
  const [proposal, setProposal] = useState(null);
  const [status, setStatus] = useState('Pending');

  // Simulate a match proposal when the page loads.
  useEffect(() => {
    // Retrieve the current user's profile (Candidate A) from localStorage.
    const candidateA = JSON.parse(localStorage.getItem('profile'));
    // Create a fake match candidate (Candidate B) with hardcoded details.
    const candidateB = {
      name: 'Jane Smith',
      age: 28,
      interests: 'Art, Community, Faith',
      instagram: '@jane_smith',
      photo: '/jane.jpg' // Make sure you have an image in the public folder, or use a placeholder URL.
    };
    const fakeProposal = { candidateA, candidateB };
    setProposal(fakeProposal);
  }, []);

  // When the user clicks "Give Green Light", mark the proposal as approved.
  const handleApprove = () => {
    setStatus('Approved');
  };

  // When the user clicks "Pass", mark the proposal as declined.
  const handlePass = () => {
    setStatus('Declined');
  };

  if (!proposal) {
    return <div>Loading match proposal...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Match Proposal</h1>
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">Potential Match: {proposal.candidateB.name}</h2>
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
          onClick={handleApprove}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
        >
          Give Green Light
        </button>
        <button
          onClick={handlePass}
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

