const express = require('express');
const router = express.Router();
const { getBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/banner.controller');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.use(protect);

router.get('/', getBanners);
router.post('/', upload.single('image'), createBanner);
router.put('/:id', upload.single('image'), updateBanner);
router.delete('/:id', authorize('superadmin', 'manager'), deleteBanner);

module.exports = router;
