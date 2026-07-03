const RefundRequest = require('../models/refundRequest');
const { Order } = require('../models');

// @desc    Submit a refund request (protected - validates order belongs to user)
// @route   POST /api/refund-requests
// @access  Private (user)
const submitRefundRequest = async (req, res, next) => {
  try {
    const { name, email, phone, orderId, reason } = req.body;

    if (!name || !email || !phone || !orderId) {
      return res.status(400).json({ success: false, error: 'Name, email, phone and order ID are required.' });
    }

    const userId = req.user.id;

    // Validate that this order number belongs to the logged-in user
    const order = await Order.findOne({ orderNumber: orderId, user: userId });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found. Please make sure the Order ID is correct and belongs to your account.'
      });
    }

    // Check if a refund request already exists for this order
    const existingRequest = await RefundRequest.findOne({ order: order._id });
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        error: `A refund request for this order already exists (Status: ${existingRequest.status}).`
      });
    }

    const refund = await RefundRequest.create({
      name,
      email,
      phone,
      orderId,
      order: order._id,
      reason,
      userId
    });

    res.status(201).json({ success: true, message: 'Refund request submitted successfully!', refund });
  } catch (error) {
    next(error);
  }
};

// @desc    Get refund requests for the logged-in user
// @route   GET /api/refund-requests/my
// @access  Private (user)
const getMyRefundRequests = async (req, res, next) => {
  try {
    const requests = await RefundRequest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all refund requests (admin)
// @route   GET /api/refund-requests
// @access  Private (Admin)
const getRefundRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [requests, total] = await Promise.all([
      RefundRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      RefundRequest.countDocuments(query)
    ]);

    res.json({ success: true, requests, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update refund request status (admin)
// @route   PUT /api/refund-requests/:id/status
// @access  Private (Admin)
const updateRefundStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const validStatuses = ['pending', 'under_review', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const request = await RefundRequest.findByIdAndUpdate(
      req.params.id,
      { status, ...(adminNotes !== undefined && { adminNotes }) },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, error: 'Refund request not found' });
    }

    res.json({ success: true, request });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete refund request (admin)
// @route   DELETE /api/refund-requests/:id
// @access  Private (Admin)
const deleteRefundRequest = async (req, res, next) => {
  try {
    const request = await RefundRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Refund request not found' });
    }
    res.json({ success: true, message: 'Refund request deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitRefundRequest, getMyRefundRequests, getRefundRequests, updateRefundStatus, deleteRefundRequest };
