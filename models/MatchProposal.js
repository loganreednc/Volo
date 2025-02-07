// models/MatchProposal.js
import mongoose from 'mongoose';

const MatchProposalSchema = new mongoose.Schema({
  candidateA: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateB: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  candidateAApproved: { type: Boolean, default: false },
  candidateBApproved: { type: Boolean, default: false },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Declined'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MatchProposal || mongoose.model('MatchProposal', MatchProposalSchema);
