import { connectToDatabase } from "../../lib/db";
import { verifyAuth } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    // Verify user authentication
    const user = await verifyAuth(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Connect to the database
    const { db } = await connectToDatabase();

    // Handle GET request to fetch user profile
    if (req.method === "GET") {
      const userProfile = await db.collection("candidates").findOne({ email: user.email });
      if (!userProfile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      return res.status(200).json({ user: userProfile });
    }

    // Handle PUT request to update user profile
    if (req.method === "PUT") {
      const { firstName, lastName, city, state, gender, birthdate, profileImage } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !city || !state || !gender || !birthdate) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Update user profile
      const updateResult = await db.collection("candidates").updateOne(
        { email: user.email },
        { $set: { firstName, lastName, city, state, gender, birthdate, profileImage } }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ error: "Profile not found or not updated" });
      }

      return res.status(200).json({ message: "Profile updated successfully" });
    }

    // Handle unsupported HTTP methods
    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ Profile Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
}