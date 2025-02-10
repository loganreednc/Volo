// pages/api/candidates.js
import { connectToDatabase } from "../../lib/db";
import { verifyAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const adminUser = await verifyAdmin(req);
    if (!adminUser) {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    const { db } = await connectToDatabase();
    const candidates = await db.collection("candidates").find({}).toArray();

    return res.status(200).json({ candidates });
  } catch (error) {
    console.error("❌ Fetch Candidates Error:", error);
    return res.status(500).json({ error: "Failed to load candidates" });
  }
}