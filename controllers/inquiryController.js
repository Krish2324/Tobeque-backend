const Inquiry = require('../models/inquiry');

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res) => {
  try {
    const { productId, productName, name, email, message } = req.body;

    const inquiry = await Inquiry.create({
      productId: productId || null,
      productName,
      name,
      email,
      message
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error creating inquiry:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private/Admin
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: inquiries });
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private/Admin
exports.updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({ success: true, data: inquiry });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private/Admin
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    res.status(200).json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
