const mongoose = require('mongoose');

const RefundRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  // The order number string (e.g. ORD-20250101-1234)
  orderId: { type: String, required: true, trim: true },
  // Reference to the actual Order document
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
  reason: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: { type: String, default: '' },
  // Link to registered user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

module.exports = mongoose.model('RefundRequest', RefundRequestSchema);
