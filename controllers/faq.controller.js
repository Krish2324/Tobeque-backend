const FAQ = require('../models/faq');

// @desc    Get all active FAQs (public)
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, faqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all FAQs including inactive (admin)
// @route   GET /api/faqs/all
// @access  Private (Admin)
const getAllFAQs = async (req, res, next) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, faqs });
  } catch (error) {
    next(error);
  }
};

// @desc    Create FAQ (admin)
// @route   POST /api/faqs
// @access  Private (Admin)
const createFAQ = async (req, res, next) => {
  try {
    const { question, answer, order, isActive } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ success: false, error: 'Question and answer are required' });
    }
    const faq = await FAQ.create({
      question,
      answer,
      order: order !== undefined ? parseInt(order) : 0,
      isActive: isActive !== undefined ? isActive : true
    });
    res.status(201).json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ (admin)
// @route   PUT /api/faqs/:id
// @access  Private (Admin)
const updateFAQ = async (req, res, next) => {
  try {
    const { question, answer, order, isActive } = req.body;
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      {
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(order !== undefined && { order: parseInt(order) }),
        ...(isActive !== undefined && { isActive })
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }

    res.json({ success: true, faq });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ (admin)
// @route   DELETE /api/faqs/:id
// @access  Private (Admin)
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, error: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFAQs, getAllFAQs, createFAQ, updateFAQ, deleteFAQ };
