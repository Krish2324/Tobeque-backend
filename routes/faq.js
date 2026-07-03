const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = require('../controllers/faq.controller');

// Public: get active FAQs
router.get('/', getFAQs);

// Admin: get ALL FAQs (including inactive)
router.get('/all', protect, getAllFAQs);

// Admin: create FAQ
router.post('/', protect, createFAQ);

// Admin: update FAQ
router.put('/:id', protect, updateFAQ);

// Admin: delete FAQ
router.delete('/:id', protect, deleteFAQ);

module.exports = router;
