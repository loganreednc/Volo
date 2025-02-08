// pages/api/candidates.js
import { connectToDatabase } from "../../lib/db";
import Candidate from "../../models/Candidate";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const { firstName, lastName, age, gender, location, email, password, instagram, photoURL } = req.body;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const existingUser = await Candidate.findOne({ email });
      if (existingUser) return res.status(400).json({ error: "Email already in use" });

      const newCandidate = new Candidate({ firstName, lastName, age, gender, location, email, password, instagram, photoURL });
      await newCandidate.save();

      res.status(201).json({ message: "User created successfully!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (req.method === "GET") {
    try {
      const session = await getSession({ req });
      if (!session) return res.status(403).json({ error: "Unauthorized" });

      let candidates = await Candidate.find().select("-password"); // Exclude password
      res.status(200).json(candidates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}





