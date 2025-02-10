// pages/api/upload.js
import nc from "next-connect"; // ✅ FIXED import
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File type validation (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG, JPG, and JPEG files are allowed"), false);
  }
};

// Setup multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file limit
});

// ✅ FIXED `next-connect` usage
const handler = nc({
  onError(error, req, res) {
    console.error("Upload Error:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

handler.use(upload.single("profileImage"));

// ✅ Handle file uploads
handler.post((req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const filePath = `/uploads/${req.file.filename}`;
  console.log("✅ File uploaded successfully:", filePath);

  res.status(200).json({ message: "File uploaded successfully", filePath });
});

// ✅ Next.js API Config to disable bodyParser (required for `multer`)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;