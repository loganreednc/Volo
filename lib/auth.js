// lib/auth.js
import jwt from "jsonwebtoken";
import { connectToDatabase } from "./db";

export async function verifyAuth(req) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { db } = await connectToDatabase();
    const user = await db.collection("candidates").findOne({ _id: decoded.id });

    return user;
  } catch (error) {
    return null;
  }
}

export async function verifyAdmin(req) {
  const user = await verifyAuth(req);
  return user && user.role === "admin" ? user : null;
}
