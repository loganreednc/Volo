// pages/api/match-proposals.js
import { connectToDatabase } from '../../lib/db';
import MatchProposal from '../../models/MatchProposal';

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { candidateAId, candidateBId } = req.body;
    try {
      const proposal = await MatchProposal.create({
        candidateA: candidateAId,
        candidateB: candidateBId,
        candidateAApproved: false,
        candidateBApproved: false,
        status: 'Pending',
      });
      res.status(201).json(proposal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    const { candidateId } = req.query;
    try {
      // Use .lean() to convert the Mongoose documents into plain objects
      const proposals = await MatchProposal.find({
        $or: [
          { candidateA: candidateId },
          { candidateB: candidateId }
        ]
      })
        .populate('candidateA candidateB')
        .lean();
      res.status(200).json(proposals);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'PATCH') {
    const { proposalId, candidate, approved } = req.body;
    try {
      const proposal = await MatchProposal.findById(proposalId);
      if (candidate === 'A') {
        proposal.candidateAApproved = approved;
      } else if (candidate === 'B') {
        proposal.candidateBApproved = approved;
      }
      if (proposal.candidateAApproved && proposal.candidateBApproved) {
        proposal.status = 'Confirmed';
      }
      await proposal.save();
      res.status(200).json(proposal);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}


