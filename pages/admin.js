// pages/admin.js
import { useState, useEffect } from 'react';
import Messaging from '../components/Messaging';

export default function AdminDashboard() {
  // State for candidate data and for match proposals/messaging
  const [candidates, setCandidates] = useState([]);
  const [selectedMale, setSelectedMale] = useState('');
  const [selectedFemale, setSelectedFemale] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  // Fetch all candidates from the API when the component loads
  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => {
        // Sanitize candidate data to remove any Mongoose metadata
        const plainData = JSON.parse(JSON.stringify(data));
        setCandidates(plainData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Handler for creating a match proposal
  const handleMatch = async () => {
    if (!selectedMale || !selectedFemale) {
      alert('Please select one male candidate and one female candidate.');
      return;
    }
    const res = await fetch('/api/match-proposals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        candidateAId: selectedMale,
        candidateBId: selectedFemale,
      }),
    });
    if (res.ok) {
      await res.json();
      alert('Match proposal created successfully!');
    } else {
      alert('Error creating match proposal.');
    }
  };

  // Filter candidates for dropdowns
  const maleCandidates = candidates.filter((c) => c.gender === 'male');
  const femaleCandidates = candidates.filter((c) => c.gender === 'female');

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Section 1: Create Match Proposal */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Create Match Proposal</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="font-bold mb-2">Male Candidates</h3>
            <select
              className="border p-2 rounded w-full"
              value={selectedMale}
              onChange={(e) => setSelectedMale(e.target.value)}
            >
              <option value="">Select a male candidate</option>
              {maleCandidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.firstName} {candidate.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="font-bold mb-2">Female Candidates</h3>
            <select
              className="border p-2 rounded w-full"
              value={selectedFemale}
              onChange={(e) => setSelectedFemale(e.target.value)}
            >
              <option value="">Select a female candidate</option>
              {femaleCandidates.map((candidate) => (
                <option key={candidate._id} value={candidate._id}>
                  {candidate.firstName} {candidate.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleMatch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Create Match Proposal
        </button>
        {proposalMessage && <p className="mt-2">{proposalMessage}</p>}
      </div>

      {/* Section 2: Messaging */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-3">Send Message to Candidate</h2>
        <label className="block font-semibold mb-1">Select Candidate:</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={selectedCandidate}
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
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



