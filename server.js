// --- Import Modules ---
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

// Firebase Admin SDK (NodeJS requires admin SDK for secure server uploads)
const { initializeApp } = require("firebase/app");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyBdQXkeo3oMtcfRZc_nOG6cpnGUJQZPcTc",
  authDomain: "fileroom-c160c.firebaseapp.com",
  projectId: "fileroom-c160c",
  storageBucket: "fileroom-c160c.appspot.com",
  messagingSenderId: "165391795974",
  appId: "1:165391795974:web:ceec441d3643b5de188087",
  measurementId: "G-TX7PP4TKSN"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

// --- Express App Setup ---
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// --- In-memory Database ---
const fileDatabase = {};

// --- Multer Setup ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000 * 1024 * 1024 } // 1000MB limit
});

// --- Helper: Generate Code ---
function generateCode() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// --- Upload Route ---
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Upload request received");

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const code = generateCode();
    const sanitizedFilename = path.basename(req.file.originalname).replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${code}-${sanitizedFilename}`;

    console.log("File received:", sanitizedFilename, "Size:", req.file.size);

    const storageRef = ref(storage, `files/${fileName}`);

    await uploadBytes(storageRef, req.file.buffer, {
      contentType: req.file.mimetype
    });

    const downloadURL = await getDownloadURL(storageRef);

    fileDatabase[code] = {
      fileName,
      originalName: req.file.originalname,
      downloadURL,
      uploadDate: new Date().toISOString()
    };

    console.log("File uploaded with code:", code);

    res.json({
      message: "File uploaded successfully",
      code,
      fileUrl: downloadURL
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

// --- Retrieve Route ---
app.get("/retrieve/:code", (req, res) => {
  const code = req.params.code.toUpperCase();
  const fileInfo = fileDatabase[code];

  if (!fileInfo) {
    return res.status(404).json({ error: "No file found with that code" });
  }

  res.json({
    fileUrl: fileInfo.downloadURL,
    fileName: fileInfo.originalName
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
