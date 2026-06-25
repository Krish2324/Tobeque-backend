const mongoose = require('mongoose');

const seasonCollectionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  displayLabel: {
    type: String,
    maxLength: 100,
    default: null
  },
  sortOrder: {
    type: Number,
    required: true,
    default: 0
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  videoUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SeasonCollection', seasonCollectionSchema);
