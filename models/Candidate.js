import mongoose from "mongoose";

const CandidateSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  city: String,
  state: String,
  birthdate: String,
  gender: { type: String, enum: ["male", "female"], required: false }, // ✅ Editable gender
  profileImage: String,
});

export default mongoose.models.Candidate || mongoose.model("Candidate", CandidateSchema);