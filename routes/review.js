const express = require('express');
const router = express.Router();
const { getReviews, toggleReviewApproval, deleteReview } = require('../controllers/review.controller');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', getReviews);
router.put('/:id/approve', toggleReviewApproval);
router.delete('/:id', authorize('superadmin', 'manager'), deleteReview);

module.exports = router;
