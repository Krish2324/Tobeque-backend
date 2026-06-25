const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  productName: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', inquirySchema);
