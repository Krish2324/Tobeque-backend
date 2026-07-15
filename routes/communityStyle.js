const express = require('express');
const router = express.Router();
const {
  getActiveCommunityStyles,
  getCommunityStyles,
  getCommunityStyle,
  createCommunityStyle,
  updateCommunityStyle,
  deleteCommunityStyle
} = require('../controllers/communityStyle.controller');

const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.get('/public', getActiveCommunityStyles);

// Protected Admin routes
router.use(protect);
router.use(authorize('superadmin', 'manager'));

router.route('/')
  .get(getCommunityStyles)
  .post(upload.single('image'), createCommunityStyle);

router.route('/:id')
  .get(getCommunityStyle)
  .put(upload.single('image'), updateCommunityStyle)
  .delete(deleteCommunityStyle);

module.exports = router;
