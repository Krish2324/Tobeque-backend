const express = require('express');
const router = express.Router();
const { getCoupons, createCoupon, updateCoupon, deleteCoupon } = require('../controllers/coupon.controller');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/', getCoupons);
router.post('/', createCoupon);
router.put('/:id', updateCoupon);
router.delete('/:id', authorize('superadmin', 'manager'), deleteCoupon);

module.exports = router;
