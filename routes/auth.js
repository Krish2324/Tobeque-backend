const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile, getAdmins, createAdmin, toggleAdminStatus } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middlewares/auth');

// Public
router.post('/login', login);

// Private
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Superadmin Protected
router.get('/admins', protect, authorize('superadmin'), getAdmins);
router.post('/admins', protect, authorize('superadmin'), createAdmin);
router.put('/admins/:id/status', protect, authorize('superadmin'), toggleAdminStatus);

module.exports = router;
