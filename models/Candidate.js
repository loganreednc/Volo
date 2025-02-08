import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true }
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Hide password from queries
  instagram: { type: String },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
CandidateSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);




