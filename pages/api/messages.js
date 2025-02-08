// pages/api/messages.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

const handler = async (req, res) => {
  if (req.method === "POST") {
    upload.single("audio")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: "File upload failed" });
      }

      // Construct audio URL
      const audioUrl = `/uploads/${req.file.filename}`;

      // Save message details
      const message = {
        sender: req.body.sender,
        receiver: req.body.receiver,
        audioUrl,
        createdAt: new Date().toISOString(),
      };

      console.log("Received voice message:", message);

      return res.status(200).json({ success: true, message });
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
