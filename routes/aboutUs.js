const express = require('express');
const router = express.Router();
const { getAboutUs, updateAboutUs } = require('../controllers/aboutUs.controller');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public route to fetch About Us content
router.get('/', getAboutUs);

// Protected Admin route to update About Us content
router.use(protect);
router.use(authorize('superadmin', 'manager'));
router.put('/', upload.single('missionImage'), updateAboutUs);

module.exports = router;
