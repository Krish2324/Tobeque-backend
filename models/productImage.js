const mongoose = require('mongoose');

const ProductImageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  color: {
    type: String,
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

module.exports = mongoose.model('ProductImage', ProductImageSchema);
