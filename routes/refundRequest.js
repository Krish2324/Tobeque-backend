const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { protectUser } = require('../middlewares/userAuth');
const {
  submitRefundRequest,
  getMyRefundRequests,
  getRefundRequests,
  updateRefundStatus,
  deleteRefundRequest
} = require('../controllers/refundRequest.controller');

// User: submit refund (must be logged in, validates order belongs to user)
router.post('/', protectUser, submitRefundRequest);

// User: get their own refund requests (for profile page)
router.get('/my', protectUser, getMyRefundRequests);

// Admin: list all requests
router.get('/', protect, getRefundRequests);

// Admin: update status
router.put('/:id/status', protect, updateRefundStatus);

// Admin: delete
router.delete('/:id', protect, deleteRefundRequest);

module.exports = router;
