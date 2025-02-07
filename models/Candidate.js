// models/Candidate.js
import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  interests: String,
  instagram: String,
  gender: { type: String, enum: ['male', 'female'], required: true },
  photoURL: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
