// pages/admin.js
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [selectedMale, setSelectedMale] = useState('');
  const [selectedFemale, setSelectedFemale] = useState('');
  const [message, setMessage] = useState('');

  // Fetch all candidates from your API when the component loads
  useEffect(() => {
    fetch('/api/candidates')
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .catch((err) => console.error(err));
  }, []);

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
      // We no longer assign the result to 'proposal' since we don't use it.
      await res.json();
      setMessage('Match proposal created successfully!');
    } else {
      setMessage('Error creating match proposal.');
    }
  };

  // Filter candidates by gender (assumes candidate.gender field)
  const maleCandidates = candidates.filter((c) => c.gender === 'male');
  const femaleCandidates = candidates.filter((c) => c.gender === 'female');

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-4">Candidates List</h2>
      <div className="grid grid-cols-2 gap-4 mb-8">
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
                {candidate.name}
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
                {candidate.name}
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
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}


