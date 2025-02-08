// pages/dashboard.js
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Dashboard() {
  // State to hold the candidate's profile from localStorage
  const [profile, setProfile] = useState(null);
  // State to hold confirmed match proposals
  const [confirmedMatches, setConfirmedMatches] = useState([]);

  // Retrieve the candidate's profile from localStorage when the component loads
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProfile = localStorage.getItem('profile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    }
  }, []);

  // Once the profile is loaded, fetch match proposals and filter for confirmed matches
  useEffect(() => {
    if (profile && profile._id) {
      fetch(`/api/match-proposals?candidateId=${profile._id}`)
        .then((res) => res.json())
        .then((data) => {
          // Only include proposals with status "Confirmed"
          const confirmed = data.filter((proposal) => proposal.status === 'Confirmed');
          setConfirmedMatches(confirmed);
        })
        .catch((err) => console.error(err));
    }
  }, [profile]);

  // If the profile hasn't loaded yet, show a loading message
  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
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
        {confirmedMatches.length === 0 ? (
          <p>No match proposals yet.</p>
        ) : (
          confirmedMatches.map((match) => {
            // Determine the matched candidate (the other candidate)
            const matchedCandidate =
              match.candidateA._id === profile._id
                ? match.candidateB
                : match.candidateA;
            return (
              <div key={match._id} className="flex items-center space-x-4 mb-4">
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
                  {/* For confirmed matches, show limited info */}
                  {/*
                    For example, only the man receives the Instagram handle.
                    This logic should be adjusted based on your rules.
                  */}
                  {profile.gender === 'male' ? (
                    <p className="text-gray-600">Instagram: {matchedCandidate.instagram}</p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



