import { connectToDatabase } from "../../lib/db";
import Candidate from "../../models/Candidate";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const existingUser = await Candidate.findOne({ email: req.body.email });
      if (existingUser) return res.status(400).json({ error: "Email already in use" });

      const newCandidate = new Candidate(req.body);
      await newCandidate.save();

      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      let candidates = await Candidate.find().select("-password"); // Exclude password from API responses
      res.status(200).json(candidates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}




