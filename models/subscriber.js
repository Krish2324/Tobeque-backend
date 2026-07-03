const mongoose = require('mongoose');

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Subscriber', SubscriberSchema);
