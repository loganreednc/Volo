import connectToDatabase from "@/lib/db";
import Match from "@/models/Match";
import Candidate from "@/models/Candidate";
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // Verify admin
    const token = await getToken({ req });
    if (!token || token.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access required" });
    }

    const { candidate1Id, candidate2Id } = req.body;

    if (!candidate1Id || !candidate2Id) {
      return res.status(400).json({ error: "Both candidates must be selected" });
    }

    // Check if candidates exist
    const candidate1 = await Candidate.findById(candidate1Id);
    const candidate2 = await Candidate.findById(candidate2Id);

    if (!candidate1 || !candidate2) {
      return res.status(404).json({ error: "Candidate(s) not found" });
    }

    // Create match entry in database
    const newMatch = await Match.create({
      candidate1: candidate1Id,
      candidate2: candidate2Id,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "Match created successfully", match: newMatch });
  } catch (error) {
    console.error("❌ Match Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
