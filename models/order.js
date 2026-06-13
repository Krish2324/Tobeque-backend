const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  subtotal: {
    type: Number,
    required: true,
    default: 0.00
  },
  taxAmount: {
    type: Number,
    required: true,
    default: 0.00
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0.00
  },
  discountAmount: {
    type: Number,
    required: true,
    default: 0.00
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0.00
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'cod'
  },
  shippingStatus: {
    type: String,
    enum: ['pending', 'shipped', 'out_for_delivery', 'delivered'],
    default: 'pending'
  },
  shippingMethod: {
    type: String
  },
  shippingAddress: {
    type: String,
    required: true
  },
  billingAddress: {
    type: String
  },
  trackingNumber: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id ? ret._id.toString() : ret.id;
      delete ret._id;
    }
  }
});

// Virtual for items
OrderSchema.virtual('items', {
  ref: 'OrderItem',
  localField: '_id',
  foreignField: 'order'
});

// Virtual for payments
OrderSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'order'
});

module.exports = mongoose.model('Order', OrderSchema);
