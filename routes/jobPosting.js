const express = require('express');
const router = express.Router();
const {
  getActiveJobPostings,
  getJobPostings,
  getJobPosting,
  createJobPosting,
  updateJobPosting,
  deleteJobPosting
} = require('../controllers/jobPosting.controller');

const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/public', getActiveJobPostings);
router.get('/:id', getJobPosting);

// Protected Admin routes
router.use(protect);
router.use(authorize('superadmin', 'manager'));

router.route('/')
  .get(getJobPostings)
  .post(createJobPosting);

router.route('/:id')
  .put(updateJobPosting)
  .delete(deleteJobPosting);

module.exports = router;
