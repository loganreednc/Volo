// pages/api/candidates.js
import { connectToDatabase } from '../../lib/db';
import Candidate from '../../models/Candidate';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    try {
      // Create a new candidate using data from req.body
      const candidate = await Candidate.create(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      // Use .lean() to convert Mongoose documents to plain objects
      const candidates = await Candidate.find({}).lean();
      res.status(200).json(candidates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


