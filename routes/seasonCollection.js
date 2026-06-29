const express = require('express');
const router = express.Router();
const {
  getSeasonCollection,
  getSeasonCollectionAdmin,
  addToSeasonCollection,
  updateSeasonCollectionItem,
  removeFromSeasonCollection
} = require('../controllers/seasonCollection.controller');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────────────
// Used by the frontend website to render the Season Collection carousel
router.get('/', getSeasonCollection);

// ─── PROTECTED ROUTES (admin JWT required) ────────────────────────────────────
router.get('/admin', protect, getSeasonCollectionAdmin);
router.post('/', protect, upload.single('image'), addToSeasonCollection);
router.put('/:id', protect, upload.single('image'), updateSeasonCollectionItem);
router.delete('/:id', protect, removeFromSeasonCollection);

module.exports = router;
