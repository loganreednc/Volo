import { connectToDatabase } from "../../../lib/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { firstName, lastName, email, password, gender } = req.body;
  if (!firstName || !lastName || !email || !password || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { db } = await connectToDatabase();
    const existingUser = await db.collection("candidates").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("candidates").insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
