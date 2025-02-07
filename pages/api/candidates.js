// pages/api/candidates.js

// Import your database connection utility and Candidate model
import { connectToDatabase } from '../../lib/db';
import Candidate from '../../models/Candidate';

export default async function handler(req, res) {
  // Connect to the database first
  await connectToDatabase();

  // Handle POST request: Create a new candidate
  if (req.method === 'POST') {
    try {
      // req.body should contain the candidate details (e.g., name, age, interests, instagram, gender, photoURL)
      const candidate = await Candidate.create(req.body);
      res.status(201).json(candidate);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // Handle GET request: Retrieve all candidates (for admin use)
  else if (req.method === 'GET') {
    try {
      const candidates = await Candidate.find({});
      res.status(200).json(candidates);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    // If method is not allowed, send a 405 response.
    res.status(405).json({ message: 'Method not allowed' });
  }
}
