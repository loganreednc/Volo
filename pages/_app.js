// models/Candidate.js
import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female'], required: true },
  location: {
    city: { type: String },
    state: { type: String }
  },
  email: { type: String, required: true },
  password: { type: String, required: true },
  instagram: { type: String },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);


