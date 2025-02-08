// pages/api/match-proposals.js

import { connectToDatabase } from '../../lib/db';
import MatchProposal from '../../models/MatchProposal';

export default async function handler(req, res) {
  // Ensure the database is connected
  await connectToDatabase();

  // POST: Create a new match proposal (admin action)
  if (req.method === 'POST') {
    const { candidateAId, candidateBId } = req.body;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const proposal = await MatchProposal.create({
        candidateA: candidateAId,
        candidateB: candidateBId,
        candidateAApproved: false,
        candidateBApproved: false,
        status: 'Pending',
      });
      // The proposal variable is used here in the response
      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // GET: Retrieve match proposals for a candidate
  else if (req.method === 'GET') {
    // Expect a query parameter "candidateId"
    const { candidateId } = req.query;
    try {
      // Find proposals where the candidate is either candidateA or candidateB
      const proposals = await MatchProposal.find({
        $or: [
          { candidateA: candidateId },
          { candidateB: candidateId }
        ]
      }).populate('candidateA candidateB'); // Populate candidate details
      res.status(200).json(proposals);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  // PATCH: Update a match proposal when a candidate responds
  else if (req.method === 'PATCH') {
    // Expect a body with: proposalId, candidate (either 'A' or 'B'), and approved (true/false)
    const { proposalId, candidate, approved } = req.body;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const proposal = await MatchProposal.findById(proposalId);
      if (candidate === 'A') {
        proposal.candidateAApproved = approved;
      } else if (candidate === 'B') {
        proposal.candidateBApproved = approved;
      }
      // If both candidates approved, update the status to 'Confirmed'
      if (proposal.candidateAApproved && proposal.candidateBApproved) {
        proposal.status = 'Confirmed';
      }
      await proposal.save();
      res.status(200).json(proposal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    // If the method is not supported, return 405 Method Not Allowed.
    res.status(405).json({ message: 'Method not allowed' });
  }
}

