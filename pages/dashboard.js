// pages/dashboard.js
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);

  // Load candidate profile from localStorage on the client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        // Sanitize the stored profile (force it to be a plain object)
        const plainProfile = JSON.parse(JSON.stringify(JSON.parse(storedProfile)));
        setProfile(plainProfile);
      }
    }
  }, []);

  // Fetch match proposals using the candidate's _id once the profile is loaded
  useEffect(() => {
    if (profile && profile._id) {
      fetch(`/api/match-proposals?candidateId=${profile._id}`)
        .then((res) => res.json())
        .then((data) => {
          // Sanitize the proposals to remove Mongoose metadata
          const plainProposals = JSON.parse(JSON.stringify(data));
          setProposals(plainProposals);
        })
        .catch((err) => console.error(err));
    }
  }, [profile]);

  // Until the profile is loaded, show a loading message
  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Candidate Profile Section */}
      <div className="border p-4 rounded flex items-center space-x-4">
        {profile.photoURL ? (
          <Image
            src={profile.photoURL}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
            No Image
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="text-gray-600">Age: {profile.age}</p>
          <p className="text-gray-600">Gender: {profile.gender}</p>
          <p className="text-gray-600">
            Location: {profile.location?.city}, {profile.location?.state}
          </p>
        </div>
      </div>

      {/* Confirmed Matches Section */}
      <div className="border p-4 rounded">
        <h2 className="text-xl font-semibold mb-4">Your Confirmed Matches</h2>
        {proposals.length === 0 ? (
          <p>No match proposals yet.</p>
        ) : (
          proposals.map((proposal) => {
            // Determine the matched candidate (the other candidate)
            const matchedCandidate =
              proposal.candidateA._id === profile._id
                ? proposal.candidateB
                : proposal.candidateA;
            return (
              <div key={proposal._id} className="flex items-center space-x-4 mb-4">
                {matchedCandidate.photoURL ? (
                  <Image
                    src={matchedCandidate.photoURL}
                    alt="Match Profile Picture"
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold">
                    {matchedCandidate.firstName} {matchedCandidate.lastName}
                  </h3>
                  <p className="text-gray-600">
                    Age: {matchedCandidate.age} | Location: {matchedCandidate.location?.city}, {matchedCandidate.location?.state}
                  </p>
                  {profile.gender === 'male' && (
                    <p className="text-gray-600">Instagram: {matchedCandidate.instagram}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div>
        <Link href="/match">
          <a className="text-blue-500 hover:underline">View Match Proposal</a>
        </Link>
      </div>
    </div>
  );
}




