const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  getUserProfile,
  getUserOrders,
  updateUserProfile,
  createOrder
} = require('../controllers/userAuth.controller');
const { protectUser } = require('../middlewares/userAuth');

// Public routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Protected user routes
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.get('/orders', protectUser, getUserOrders);
router.post('/orders', protectUser, createOrder);

module.exports = router;
