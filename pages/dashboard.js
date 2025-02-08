// pages/dashboard.js
export const dynamic = "force-dynamic"; // ✅ Prevents SSR issues

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (profile && profile._id) {
      fetch(`/api/match-proposals?candidateId=${profile._id}`)
        .then((res) => res.json())
        .then((data) => {
          // ✅ Ensure JSON-serializable data
          const cleanedProposals = data.map((proposal) => ({
            ...proposal,
            candidateA: JSON.parse(JSON.stringify(proposal.candidateA)),
            candidateB: JSON.parse(JSON.stringify(proposal.candidateB)),
          }));
          setProposals(cleanedProposals);
        })
        .catch((err) => console.error(err));
    }
  }, [profile]);

  if (loading) {
    return <div className="p-4">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="p-4">No profile found. Please log in.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      {/* Candidate Profile Section */}
      <div className="border p-4 rounded flex items-center space-x-4">
        <Image
          src={profile.photoURL || "/default-profile.png"} // ✅ Fallback image
          alt="Profile Picture"
          width={80}
          height={80}
          className="rounded-full object-cover"
        />
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
            const matchedCandidate =
              proposal.candidateA._id === profile._id
                ? proposal.candidateB
                : proposal.candidateA;
            return (
              <div key={proposal._id} className="flex items-center space-x-4 mb-4">
                <Image
                  src={matchedCandidate.photoURL || "/default-profile.png"} // ✅ Fallback image
                  alt="Match Profile Picture"
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold">
                    {matchedCandidate.firstName} {matchedCandidate.lastName}
                  </h3>
                  <p className="text-gray-600">
                    Age: {matchedCandidate.age} | Location: {matchedCandidate.location?.city},{" "}
                    {matchedCandidate.location?.state}
                  </p>
                  {profile.gender === "male" && (
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
          <span className="text-blue-500 hover:underline cursor-pointer">View Match Proposal</span>
        </Link>
      </div>
    </div>
  );
}
