import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Candidate from "@/models/Candidate";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();

    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await Candidate.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    console.log("🔍 Checking password for:", email);
    console.log("📥 Entered Password:", password);
    console.log("🔐 Stored Hashed Password:", user.password);

    // ✅ Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Password mismatch for: ${email}`);
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    console.log(`✅ Login Successful: ${email}`);
    return res.status(200).json({ message: "Login successful", token, user });

  } catch (error) {
    console.error("❌ Login API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
