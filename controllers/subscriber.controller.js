const Subscriber = require('../models/subscriber');

// @desc    Subscribe to newsletter (public)
// @route   POST /api/subscribers
// @access  Public
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required.' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
      }
      return res.status(400).json({ success: false, error: 'This email is already subscribed.' });
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: 'Thank you for subscribing to our newsletter!' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'This email is already subscribed.' });
    }
    next(error);
  }
};

// @desc    Get all subscribers (admin)
// @route   GET /api/subscribers
// @access  Private (Admin)
const getSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [subscribers, total] = await Promise.all([
      Subscriber.find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Subscriber.countDocuments()
    ]);

    res.json({ success: true, subscribers, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subscriber (admin)
// @route   DELETE /api/subscribers/:id
// @access  Private (Admin)
const deleteSubscriber = async (req, res, next) => {
  try {
    const sub = await Subscriber.findByIdAndDelete(req.params.id);
    if (!sub) return res.status(404).json({ success: false, error: 'Subscriber not found' });
    res.json({ success: true, message: 'Subscriber deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, getSubscribers, deleteSubscriber };
