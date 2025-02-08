// pages/api/messages.js
import { connectToDatabase } from "../../lib/db";
import Message from "../../models/Message";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "GET") {
    const { candidateId } = req.query;
    if (!candidateId) return res.status(400).json({ error: "candidateId is required" });

    try {
      const messages = await Message.find({
        $or: [{ sender: candidateId }, { receiver: candidateId }],
      })
        .sort({ createdAt: 1 })
        .lean();

      return res.status(200).json(messages);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else if (req.method === "POST") {
    const { sender, receiver, text } = req.body;
    if (!sender || !receiver || !text) return res.status(400).json({ error: "All fields required" });

    try {
      const message = await Message.create({ sender, receiver, text });
      return res.status(201).json(message);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}



