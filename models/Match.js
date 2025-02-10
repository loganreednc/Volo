import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
  candidate1: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  candidate2: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Match || mongoose.model("Match", MatchSchema);
