const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleStatus,
  uploadImage
} = require('../controllers/blog.controller');

const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Public routes
router.route('/')
  .get(getBlogs);

router.route('/:id')
  .get(getBlogById);

// Protected Admin routes
router.use(protect);
router.use(authorize('superadmin', 'manager', 'editor'));

router.post('/upload-image', upload.single('image'), uploadImage);

router.route('/')
  .post(createBlog);

router.route('/:id')
  .put(updateBlog)
  .delete(deleteBlog);

router.route('/:id/status')
  .patch(toggleStatus);

module.exports = router;
