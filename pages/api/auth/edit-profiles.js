import connectToDatabase from "@/lib/db";
import Candidate from "@/models/Candidate";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "PUT") return res.status(405).json({ error: "Method Not Allowed" });

  await connectToDatabase();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Candidate.findById(decoded.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    const { firstName, lastName, city, state, gender } = req.body;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.city = city || user.city;
    user.state = state || user.state;
    user.gender = gender || user.gender;

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
