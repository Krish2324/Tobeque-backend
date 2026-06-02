const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  getUserProfile,
  getUserOrders,
  updateUserProfile
} = require('../controllers/userAuth.controller');
const { protectUser } = require('../middlewares/userAuth');

// Public routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected user routes
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.get('/orders', protectUser, getUserOrders);

module.exports = router;
