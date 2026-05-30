const { Category, Brand, AdminLog } = require('../models');

// Helper to slugify
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// === CATEGORIES MODULE ===

// @desc    Get Nested Categories Tree
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    // Fetch only root categories (parentId = null) and recursively include their subcategories
    const categories = await Category.findAll({
      where: { parentId: null },
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: [{ model: Category, as: 'subcategories' }] // Support up to 3 levels out-of-the-box
        }
      ],
      order: [['name', 'ASC']]
    });

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name, slug: providedSlug, description, parentId, seoTitle, seoDescription, displayType, googleProductCategory } = req.body;

    const slug = providedSlug ? slugify(providedSlug) : (slugify(name) + '-' + Math.floor(Math.random() * 1000));

    let image = '';
    let banner = '';

    if (req.files) {
      if (req.files.image) {
        image = `/uploads/products/${req.files.image[0].filename}`;
      }
      if (req.files.banner) {
        banner = `/uploads/products/${req.files.banner[0].filename}`;
      }
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parentId: parentId ? parseInt(parentId) : null,
      image,
      banner,
      seoTitle,
      seoDescription,
      displayType: displayType || 'Default',
      googleProductCategory
    });

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Created category: ${category.name}`,
      entityType: 'category',
      entityId: category.id,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const { name, slug: providedSlug, description, parentId, seoTitle, seoDescription, displayType, googleProductCategory } = req.body;

    if (name && name !== category.name) {
      category.name = name;
      if (!providedSlug) {
        category.slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);
      }
    }
    if (providedSlug && providedSlug !== category.slug) {
      category.slug = slugify(providedSlug);
    }

    category.description = description !== undefined ? description : category.description;
    category.seoTitle = seoTitle !== undefined ? seoTitle : category.seoTitle;
    category.seoDescription = seoDescription !== undefined ? seoDescription : category.seoDescription;
    category.displayType = displayType !== undefined ? displayType : category.displayType;
    category.googleProductCategory = googleProductCategory !== undefined ? googleProductCategory : category.googleProductCategory;
    
    if (parentId !== undefined) {
      // Prevent mapping to self as parent
      if (parentId && parseInt(parentId) === category.id) {
        return res.status(400).json({ success: false, error: 'Category cannot be its own subcategory parent' });
      }
      category.parentId = parentId ? parseInt(parentId) : null;
    }

    if (req.files) {
      if (req.files.image) {
        category.image = `/uploads/products/${req.files.image[0].filename}`;
      }
      if (req.files.banner) {
        category.banner = `/uploads/products/${req.files.banner[0].filename}`;
      }
    }

    await category.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Updated category: ${category.name}`,
      entityType: 'category',
      entityId: category.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    const catName = category.name;
    const catId = category.id;

    await category.destroy();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Deleted category: ${catName}`,
      entityType: 'category',
      entityId: catId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Category successfully deleted'
    });
  } catch (error) {
    next(error);
  }
};

// === BRANDS MODULE ===

// @desc    Get All Brands
// @route   GET /api/brands
// @access  Private
const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ order: [['name', 'ASC']] });
    res.json({
      success: true,
      brands
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Brand
// @route   POST /api/brands
// @access  Private
const createBrand = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);

    let logo = '';
    if (req.file) {
      logo = `/uploads/products/${req.file.filename}`;
    }

    const brand = await Brand.create({
      name,
      slug,
      logo,
      description
    });

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Created brand: ${brand.name}`,
      entityType: 'brand',
      entityId: brand.id,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Brand
// @route   PUT /api/brands/:id
// @access  Private
const updateBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const { name, description } = req.body;

    if (name && name !== brand.name) {
      brand.name = name;
      brand.slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);
    }

    brand.description = description !== undefined ? description : brand.description;

    if (req.file) {
      brand.logo = `/uploads/products/${req.file.filename}`;
    }

    await brand.save();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Updated brand: ${brand.name}`,
      entityType: 'brand',
      entityId: brand.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      brand
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Brand
// @route   DELETE /api/brands/:id
// @access  Private
const deleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) {
      return res.status(404).json({ success: false, error: 'Brand not found' });
    }

    const brandName = brand.name;
    const brandId = brand.id;

    await brand.destroy();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Deleted brand: ${brandName}`,
      entityType: 'brand',
      entityId: brandId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Brand successfully deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand
};
