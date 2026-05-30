const express = require('express');
const router = express.Router();
const {
  getCategories, createCategory, updateCategory, deleteCategory,
  getBrands, createBrand, updateBrand, deleteBrand
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// Protect all routes
router.use(protect);

// === Category Routes ===
router.get('/', getCategories);
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  createCategory
);
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'banner', maxCount: 1 }
  ]),
  updateCategory
);
router.delete('/:id', authorize('superadmin', 'manager'), deleteCategory);

// === Brand Routes ===
router.get('/brands/all', getBrands);
router.post('/brands', upload.single('logo'), createBrand);
router.put('/brands/:id', upload.single('logo'), updateBrand);
router.delete('/brands/:id', authorize('superadmin', 'manager'), deleteBrand);

module.exports = router;
