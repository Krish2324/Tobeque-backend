const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload folders exist
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Configure Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Dynamic subfolders depending on entity
    let folder = 'uploads/';
    
    if (req.originalUrl.includes('products')) {
      folder += 'products/';
    } else if (req.originalUrl.includes('banners')) {
      folder += 'banners/';
    } else if (req.originalUrl.includes('season-collection')) {
      folder += 'season/';
    } else if (req.originalUrl.includes('settings') || req.originalUrl.includes('site')) {
      folder += 'site/';
    } else {
      folder += 'misc/';
    }

    const fullPath = path.join(__dirname, '..', folder);
    ensureDirExists(fullPath);
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Clean and unique filenames
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const cleanExt = path.extname(file.originalname).toLowerCase();
    cb(null, `${file.fieldname}-${uniqueSuffix}${cleanExt}`);
  }
});

// File Filter rules
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|mp4|webm|ogg|mov/i;
  const isMatch = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimeTypeMatch = allowedExtensions.test(file.mimetype);

  if (isMatch && mimeTypeMatch) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files (JPEG, JPG, PNG, GIF, WEBP, MP4, WEBM, OGG, MOV) are allowed!'), false);
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB Max
  fileFilter: fileFilter
});

module.exports = upload;
