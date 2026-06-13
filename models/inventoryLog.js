const mongoose = require('mongoose');

const InventoryLogSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  stockChanged: {
    type: Number,
    required: true
  },
  actionType: {
    type: String,
    enum: ['restock', 'sale', 'correction', 'return'],
    default: 'correction',
    required: true
  },
  reference: {
    type: String
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
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

module.exports = mongoose.model('InventoryLog', InventoryLogSchema);
