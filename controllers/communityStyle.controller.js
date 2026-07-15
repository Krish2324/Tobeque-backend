const CommunityStyle = require('../models/communityStyle');
const { AdminLog } = require('../models');

// @desc    Get all active community styles
// @route   GET /api/community-styles/public
// @access  Public
exports.getActiveCommunityStyles = async (req, res, next) => {
  try {
    const styles = await CommunityStyle.find({ status: 'Active' }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: styles.length, data: styles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all community styles (Admin)
// @route   GET /api/community-styles
// @access  Private (Admin)
exports.getCommunityStyles = async (req, res, next) => {
  try {
    const styles = await CommunityStyle.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: styles.length, data: styles });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single community style
// @route   GET /api/community-styles/:id
// @access  Private (Admin)
exports.getCommunityStyle = async (req, res, next) => {
  try {
    const style = await CommunityStyle.findById(req.params.id);
    if (!style) {
      return res.status(404).json({ success: false, error: 'Style not found' });
    }
    res.status(200).json({ success: true, data: style });
  } catch (error) {
    next(error);
  }
};

// @desc    Create community style
// @route   POST /api/community-styles
// @access  Private (Admin)
exports.createCommunityStyle = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const style = await CommunityStyle.create(req.body);
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Created community style: ${style.id}`,
        entityType: 'communityStyle',
        entityId: style.id,
        ipAddress: req.ip
      });
    }
    res.status(201).json({ success: true, data: style });
  } catch (error) {
    next(error);
  }
};

// @desc    Update community style
// @route   PUT /api/community-styles/:id
// @access  Private (Admin)
exports.updateCommunityStyle = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = req.file.path;
    }

    const style = await CommunityStyle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!style) {
      return res.status(404).json({ success: false, error: 'Style not found' });
    }
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Updated community style: ${style.id}`,
        entityType: 'communityStyle',
        entityId: style.id,
        ipAddress: req.ip
      });
    }
    res.status(200).json({ success: true, data: style });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete community style
// @route   DELETE /api/community-styles/:id
// @access  Private (Admin)
exports.deleteCommunityStyle = async (req, res, next) => {
  try {
    const style = await CommunityStyle.findById(req.params.id);
    if (!style) {
      return res.status(404).json({ success: false, error: 'Style not found' });
    }
    await style.deleteOne();
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Deleted community style: ${style.id}`,
        entityType: 'communityStyle',
        entityId: style.id,
        ipAddress: req.ip
      });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
