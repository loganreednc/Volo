// models/Candidate.js
import mongoose from 'mongoose';

let Candidate;

if (typeof window === 'undefined') {
  // On the server side, define the Candidate schema and model.
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

  Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
} else {
  // On the client side, export an empty object.
  Candidate = {};
}

export default Candidate;



