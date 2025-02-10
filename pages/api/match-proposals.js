import { connectToDatabase } from "../../lib/db";
import { verifyAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const adminCheck = await verifyAdmin(req);
    if (!adminCheck) {
      return res.status(403).json({ error: "Forbidden - Admin only" });
    }

    try {
      const { db } = await connectToDatabase();
      const matches = await db.collection("matches").find({}).toArray();
      return res.status(200).json(matches);
    } catch (error) {
      console.error("Match Proposals Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
