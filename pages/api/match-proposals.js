// pages/api/match-proposals.js
import { connectToDatabase } from "../../lib/db";
import MatchProposal from "../../models/MatchProposal";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    const session = await getSession({ req });
    if (!session) return res.status(403).json({ error: "Unauthorized" });

    const { candidateAId, candidateBId } = req.body;
    try {
      const proposal = await MatchProposal.create({
        candidateA: candidateAId,
        candidateB: candidateBId,
        candidateAApproved: false,
        candidateBApproved: false,
        status: "Pending",
      });

      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}






