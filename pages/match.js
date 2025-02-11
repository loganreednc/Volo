export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Match() {
  const router = useRouter();
  const [proposal, setProposal] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        const candidateA = JSON.parse(storedProfile);
        const candidateB = {
          firstName: "Jane",
          lastName: "Smith",
          age: 28,
          interests: "Art, Community, Faith",
          instagram: "@jane_smith",
          email: "jane.smith@example.com", // ✅ Added email for notifications
          photo: "/jane.jpg",
        };
        setProposal({ candidateA, candidateB });
      }
      setLoading(false);
    }
  }, []);

  const approveMatch = async () => {
    setStatus("Approved");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: proposal.candidateB.email, // ✅ Send email to match
          matchName: `${proposal.candidateA.firstName} ${proposal.candidateA.lastName}`,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Email sent:", data.message);
      } else {
        console.error("Error sending email:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return <div className="p-4">Loading match proposal...</div>;
  }

  if (!proposal) {
    return <div className="p-4">No match proposal found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Match Proposal</h1>
      <div className="border p-4 rounded mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Potential Match: {proposal.candidateB.firstName} {proposal.candidateB.lastName}
        </h2>
        <p className="mb-1">
          <strong>Age:</strong> {proposal.candidateB.age}
        </p>
        <p className="mb-1">
          <strong>Interests:</strong> {proposal.candidateB.interests}
        </p>
        <div className="relative w-36 h-36">
          <Image
            src={proposal.candidateB.photo || "https://via.placeholder.com/150"}
            alt="Match"
            layout="fill"
            objectFit="cover"
            className="rounded"
          />
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={approveMatch} // ✅ Now triggers email notification
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
        >
          Give Green Light
        </button>
        <button
          onClick={() => setStatus("Declined")}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Pass
        </button>
      </div>
      <p className="mb-4">
        <strong>Status:</strong> {status}
      </p>
      {status === "Approved" && (
        <div className="border p-4 rounded border-green-500">
          <h2 className="text-xl font-semibold mb-2">Match Confirmed!</h2>
          <p className="mb-2">You can now view full details.</p>
          <p className="mb-2">
            <strong>Instagram:</strong> {proposal.candidateB.instagram}
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
      {status === "Declined" && (
        <div className="border p-4 rounded border-red-500">
          <h2 className="text-xl font-semibold mb-2">Match Declined</h2>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}