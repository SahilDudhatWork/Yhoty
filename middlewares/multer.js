// const { S3Client } = require("@aws-sdk/client-s3");
// const multer = require("multer");
// const multerS3 = require("multer-s3");
// const path = require("path");

// // AWS S3 Configuration using AWS SDK v3
// const s3 = new S3Client({
//   region: process.env.AWS_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // File filter for validation
// const fileFilter = (req, file, cb) => {
//   cb(null, true);
// };

// // Multer S3 Storage Configuration
// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.AWS_S3_BUCKET,
//     key: (req, file, cb) => {
//       const filename = `${Date.now()}-${file.originalname}`;
//       cb(null, filename);
//     },
//   }),
//   fileFilter: fileFilter,
//   limits: { fileSize: 1024 * 1024 * 15 }, // Limit file size to 15MB
// });

// module.exports = upload;

// -*-*--*-*-*-*-*-*-*-*-*-*-*
// -*-*--*-*-*-*-*-*-*-*-*-*-*
// -*-*--*-*-*-*-*-*-*-*-*-*-*

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, "../public/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration for Local Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Specify the uploads folder
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

// File filter for validation (optional, can customize)
const fileFilter = (req, file, cb) => {
  cb(null, true); // Accept all files for now
};

// Configure Multer with local storage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 15 }, // Limit file size to 15MB
});

module.exports = upload;
