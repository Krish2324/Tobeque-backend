const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protect } = require('../middlewares/auth');
const {
  submitApplication,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
  optionalUserAuth
} = require('../controllers/jobApplication.controller');

const fs = require('fs');

// Ensure the uploads/cvs directory exists
const cvsDir = path.join(__dirname, '../uploads/cvs');
if (!fs.existsSync(cvsDir)) {
  fs.mkdirSync(cvsDir, { recursive: true });
}

// Local disk storage for CVs
const cvStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, cvsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cv-' + uniqueSuffix + ext);
  }
});

const cvFileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx/i;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  if (extOk) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for CV upload'), false);
  }
};

const uploadCV = multer({
  storage: cvStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: cvFileFilter
});

// Public: submit application (optionally authenticated)
router.post('/', optionalUserAuth, uploadCV.single('cv'), submitApplication);

// Admin: get all applications
router.get('/', protect, getApplications);

// Admin: update status
router.put('/:id/status', protect, updateApplicationStatus);

// Admin: delete
router.delete('/:id', protect, deleteApplication);

module.exports = router;
