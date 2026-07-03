const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  cvOriginalName: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
