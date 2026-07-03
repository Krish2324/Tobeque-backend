const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { subscribe, getSubscribers, deleteSubscriber } = require('../controllers/subscriber.controller');

// Public: Subscribe to newsletter
router.post('/', subscribe);

// Admin: Get all subscribers
router.get('/', protect, getSubscribers);

// Admin: Delete subscriber
router.delete('/:id', protect, deleteSubscriber);

module.exports = router;
