// models/Candidate.js
import mongoose from 'mongoose';

// If we're running on the client (browser), return a stub to avoid bundling server-only code.
if (typeof window !== 'undefined') {
  // On the client, export an empty object.
  export default {};
} else {
  // Define the Candidate schema for server-side use
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
}


