const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  transactionId: {
    type: String,
    unique: true
  },
  gateway: {
    type: String,
    required: true,
    default: 'stripe'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'pending', 'refunded'],
    default: 'pending',
    required: true
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
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

module.exports = mongoose.model('Payment', PaymentSchema);
