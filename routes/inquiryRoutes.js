const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middlewares/auth');

// Public route to submit an inquiry
router.post('/', createInquiry);

// Admin routes
router.get('/', protect, authorize('superadmin', 'manager', 'editor'), getInquiries);
router.put('/:id/status', protect, authorize('superadmin', 'manager', 'editor'), updateInquiryStatus);
router.delete('/:id', protect, authorize('superadmin', 'manager', 'editor'), deleteInquiry);

module.exports = router;
