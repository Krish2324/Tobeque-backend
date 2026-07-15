const mongoose = require('mongoose');

const CommunityStyleSchema = new mongoose.Schema({
  image: {
    type: String,
    required: [true, 'Please add an image']
  },
  altText: {
    type: String,
    required: [true, 'Please add alt text for accessibility']
  },
  tag: {
    type: String,
    default: '@tobeque'
  },
  productLink: {
    type: String,
    default: '/collection'
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('CommunityStyle', CommunityStyleSchema);
