// models/Candidate.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 99 },
  gender: { type: String, enum: ["male", "female"], required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  instagram: { type: String, trim: true },
  photoURL: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// 🔹 Hash password before saving to DB
CandidateSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Create an index for faster email lookup
CandidateSchema.index({ email: 1 });

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);





