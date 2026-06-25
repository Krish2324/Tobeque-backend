const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getBrands, createBrand, updateBrand, deleteBrand
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// ─── PUBLIC ROUTES (no auth required) ────────────────────────────────────────
// Used by the frontend website to list categories & brands
router.get('/public', getCategories);
router.get('/brands/all', getBrands);

// ─── PROTECTED ROUTES (admin JWT required) ────────────────────────────────────
router.get('/', protect, getCategories);
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  createCategory
);
router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  updateCategory
);
router.delete('/:id', protect, authorize('superadmin', 'manager'), deleteCategory);

// === Brand Protected Routes ===
router.post('/brands', protect, upload.single('logo'), createBrand);
router.put('/brands/:id', protect, upload.single('logo'), updateBrand);
router.delete('/brands/:id', protect, authorize('superadmin', 'manager'), deleteBrand);

module.exports = router;
