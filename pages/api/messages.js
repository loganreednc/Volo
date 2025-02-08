// pages/api/messages.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export default function handler(req, res) {
  if (req.method === "POST") {
    upload.single("audio")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "File upload failed" });
      }

      const { sender, receiver } = req.body;
      const audioUrl = `/uploads/${req.file.filename}`;

      const newMessage = {
        sender,
        receiver,
        audioUrl,
        createdAt: new Date().toISOString(),
      };

      return res.status(201).json(newMessage);
    });
  } else if (req.method === "GET") {
    res.status(200).json([]);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
