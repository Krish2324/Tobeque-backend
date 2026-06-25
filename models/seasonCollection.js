const mongoose = require('mongoose');

const seasonCollectionSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
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
  imageOverride: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SeasonCollection', seasonCollectionSchema);
