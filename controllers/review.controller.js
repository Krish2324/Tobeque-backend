const { Review, Product, User, AdminLog } = require('../models');

// @desc    Get List of All Reviews
// @route   GET /api/reviews
// @access  Private
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'thumbnail'] },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Moderate Product Review
// @route   PUT /api/reviews/:id/approve
// @access  Private
const toggleReviewApproval = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approve } = req.body; // boolean

    const review = await Review.findByPk(id, {
      include: [{ model: Product, as: 'product', attributes: ['name'] }]
    });

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    review.isApproved = approve !== undefined ? approve : !review.isApproved;
    await review.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `${review.isApproved ? 'Approved' : 'Unapproved'} review for product: ${review.product.name}`,
      entityType: 'review',
      entityId: review.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: `Review has been successfully ${review.isApproved ? 'approved and published' : 'hidden'}`,
      review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Product Review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    const reviewId = review.id;

    await review.destroy();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Deleted product review ID #${reviewId}`,
      entityType: 'review',
      entityId: reviewId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Review successfully removed from system'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  toggleReviewApproval,
  deleteReview
};
