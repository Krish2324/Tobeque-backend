const { SeasonCollection, Category, AdminLog } = require('../models');

// @desc    Get Season Collection (Public - for the website)
// @route   GET /api/season-collection
// @access  Public
const getSeasonCollection = async (req, res, next) => {
  try {
    const items = await SeasonCollection.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .populate({
        path: 'category',
        select: 'name slug image banner description'
      });

    // Filter out items where the linked category is missing
    const validItems = items.filter(
      (item) => item.category != null
    ).map(item => ({
      ...item.toJSON(),
      categoryId: item.category._id,
      id: item._id
    }));

    res.json({ success: true, data: validItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Season Collection Items (Admin - includes inactive)
// @route   GET /api/season-collection/admin
// @access  Private
const getSeasonCollectionAdmin = async (req, res, next) => {
  try {
    const items = await SeasonCollection.find()
      .sort({ sortOrder: 1, createdAt: 1 })
      .populate({
        path: 'category',
        select: 'name slug image banner description'
      });

    const mappedItems = items.map(item => ({
      ...item.toJSON(),
      categoryId: item.category ? item.category._id : null,
      id: item._id
    }));

    res.json({ success: true, data: mappedItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Add Category to Season Collection
// @route   POST /api/season-collection
// @access  Private
const addToSeasonCollection = async (req, res, next) => {
  try {
    const { categoryId, displayLabel, sortOrder, isActive, imageOverride } = req.body;

    if (!categoryId) {
      return res.status(400).json({ success: false, error: 'categoryId is required' });
    }

    // Check if already in collection
    const existing = await SeasonCollection.findOne({ category: categoryId });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'This category is already in the Season Collection'
      });
    }

    const item = await SeasonCollection.create({
      category: categoryId,
      displayLabel: displayLabel || null,
      sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
      imageOverride: imageOverride || null
    });

    await AdminLog.create({
      adminId: req.admin._id || req.admin.id,
      action: `Added category ID ${categoryId} to Season Collection`,
      entityType: 'season_collection',
      entityId: item._id,
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Season Collection Item
// @route   PUT /api/season-collection/:id
// @access  Private
const updateSeasonCollectionItem = async (req, res, next) => {
  try {
    const item = await SeasonCollection.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Season Collection item not found' });
    }

    const { displayLabel, sortOrder, isActive, imageOverride } = req.body;

    if (displayLabel !== undefined) item.displayLabel = displayLabel;
    if (sortOrder !== undefined) item.sortOrder = parseInt(sortOrder);
    if (isActive !== undefined) item.isActive = isActive === 'true' || isActive === true;
    if (imageOverride !== undefined) item.imageOverride = imageOverride || null;

    await item.save();

    await AdminLog.create({
      adminId: req.admin._id || req.admin.id,
      action: `Updated Season Collection item ID ${item._id}`,
      entityType: 'season_collection',
      entityId: item._id,
      ipAddress: req.ip
    });

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove Category from Season Collection
// @route   DELETE /api/season-collection/:id
// @access  Private
const removeFromSeasonCollection = async (req, res, next) => {
  try {
    const item = await SeasonCollection.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, error: 'Season Collection item not found' });
    }

    const itemId = item._id;
    await item.deleteOne();

    await AdminLog.create({
      adminId: req.admin._id || req.admin.id,
      action: `Removed item ID ${itemId} from Season Collection`,
      entityType: 'season_collection',
      entityId: itemId,
      ipAddress: req.ip
    });

    res.json({ success: true, message: 'Item removed from Season Collection' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSeasonCollection,
  getSeasonCollectionAdmin,
  addToSeasonCollection,
  updateSeasonCollectionItem,
  removeFromSeasonCollection
};
