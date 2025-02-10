import { connectToDatabase } from "../../lib/db";
import { verifyAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ✅ Verify if the user is an admin before proceeding
  const adminCheck = await verifyAdmin(req);
  if (!adminCheck) {
    return res.status(403).json({ error: "Forbidden - Admin access required" });
  }

  // ✅ Extract match details from request body
  const { maleId, femaleId } = req.body;
  if (!maleId || !femaleId) {
    return res.status(400).json({ error: "Both male and female candidates are required" });
  }

  try {
    const { db } = await connectToDatabase();

    // ✅ Insert the match into the `matches` collection
    await db.collection("matches").insertOne({
      maleId,
      femaleId,
      status: "Pending", // Match needs approval
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Match Assigned Successfully" });
  } catch (error) {
    console.error("❌ Match Assignment Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}