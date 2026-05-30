const { Product, ProductImage, Category, Brand, InventoryLog, AdminLog } = require('../models');
const { Op } = require('sequelize');

// Helper to slugify strings
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// @desc    Get List of Products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
      brand,
      status,
      featured,
      sortBy = 'createdAt',
      sortDir = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    // Build query conditions
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
        { shortDescription: { [Op.like]: `%${search}%` } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    if (brand) {
      where.brandId = brand;
    }

    if (status) {
      where.status = status;
    }

    if (featured !== undefined) {
      where.isFeatured = featured === 'true';
    }

    const { count, rows } = await Product.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortDir.toUpperCase()]],
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'imageUrl'] }
      ],
      distinct: true // Avoids incorrect counting due to include relations
    });

    res.json({
      success: true,
      data: {
        products: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Single Product Detail
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: Brand, as: 'brand', attributes: ['id', 'name'] },
        { model: ProductImage, as: 'images', attributes: ['id', 'imageUrl'] }
      ]
    });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create Product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      barcode,
      shortDescription,
      fullDescription,
      price,
      discountPrice,
      taxRate,
      stockQuantity,
      weight,
      dimensions,
      status,
      isFeatured,
      categoryId,
      brandId,
      variants,
      seoTitle,
      seoDescription,
      countdownEvergreen,
      restartCountdownAfter,
      countdownTimerProfile,
      enableProgressBar,
      whenAchievingGoal,
      goal,
      initialQuantity,
      taxStatus,
      taxClass,
      hsnSacCode,
      whatsAppNumber,
      callToAction,
      preFilledMessage,
      displaySettings
    } = req.body;

    // Check SKU unique
    const skuExists = await Product.findOne({ where: { sku } });
    if (skuExists) {
      return res.status(400).json({ success: false, error: `SKU '${sku}' already exists` });
    }

    // Auto slug
    const slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);

    // Get thumbnail from uploaded files (Multer saves to req.file or req.files)
    let thumbnail = '';
    if (req.files && req.files.thumbnail) {
      // Standard local path relative to site
      thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
    }

    // Parse variants if they are sent as JSON strings
    let parsedVariants = variants;
    if (typeof variants === 'string') {
      try {
        parsedVariants = JSON.parse(variants);
      } catch (err) {
        parsedVariants = null;
      }
    }

    const product = await Product.create({
      name,
      slug,
      sku,
      barcode,
      shortDescription,
      fullDescription,
      price: parseFloat(price) || 0.00,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      taxRate: parseFloat(taxRate) || 0.00,
      stockQuantity: parseInt(stockQuantity) || 0,
      weight: weight ? parseFloat(weight) : null,
      dimensions,
      status: status || 'draft',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      thumbnail,
      categoryId: categoryId ? parseInt(categoryId) : null,
      brandId: brandId ? parseInt(brandId) : null,
      variants: parsedVariants,
      seoTitle,
      seoDescription,
      countdownEvergreen: countdownEvergreen === 'true' || countdownEvergreen === true,
      restartCountdownAfter: restartCountdownAfter ? parseInt(restartCountdownAfter) : null,
      countdownTimerProfile,
      enableProgressBar: enableProgressBar === 'true' || enableProgressBar === true,
      whenAchievingGoal,
      goal: goal ? parseInt(goal) : null,
      initialQuantity: initialQuantity ? parseInt(initialQuantity) : null,
      taxStatus,
      taxClass,
      hsnSacCode,
      whatsAppNumber,
      callToAction,
      preFilledMessage,
      displaySettings
    });

    // Record stock addition log
    await InventoryLog.create({
      productId: product.id,
      stockChanged: product.stockQuantity,
      actionType: 'restock',
      reference: 'Initial product stock creation',
      adminId: req.admin.id
    });

    // Create additional product gallery images if uploaded
    if (req.files && req.files.images) {
      const imageRecords = req.files.images.map((img) => ({
        productId: product.id,
        imageUrl: `/uploads/products/${img.filename}`
      }));
      await ProductImage.bulkCreate(imageRecords);
    }

    // Save Admin action log
    await AdminLog.create({
      adminId: req.admin.id,
      action: `Created product: ${product.name}`,
      entityType: 'product',
      entityId: product.id,
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const oldStock = product.stockQuantity;

    const {
      name,
      sku,
      barcode,
      shortDescription,
      fullDescription,
      price,
      discountPrice,
      taxRate,
      stockQuantity,
      weight,
      dimensions,
      status,
      isFeatured,
      categoryId,
      brandId,
      variants,
      seoTitle,
      seoDescription,
      countdownEvergreen,
      restartCountdownAfter,
      countdownTimerProfile,
      enableProgressBar,
      whenAchievingGoal,
      goal,
      initialQuantity,
      taxStatus,
      taxClass,
      hsnSacCode,
      whatsAppNumber,
      callToAction,
      preFilledMessage,
      displaySettings
    } = req.body;

    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ where: { sku } });
      if (skuExists) {
        return res.status(400).json({ success: false, error: `SKU '${sku}' already exists` });
      }
      product.sku = sku;
    }

    if (name && name !== product.name) {
      product.name = name;
      product.slug = slugify(name) + '-' + Math.floor(Math.random() * 1000);
    }

    product.barcode = barcode !== undefined ? barcode : product.barcode;
    product.shortDescription = shortDescription !== undefined ? shortDescription : product.shortDescription;
    product.fullDescription = fullDescription !== undefined ? fullDescription : product.fullDescription;
    product.price = price !== undefined ? parseFloat(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : product.discountPrice;
    product.taxRate = taxRate !== undefined ? parseFloat(taxRate) : product.taxRate;
    product.weight = weight !== undefined ? (weight ? parseFloat(weight) : null) : product.weight;
    product.dimensions = dimensions !== undefined ? dimensions : product.dimensions;
    product.status = status !== undefined ? status : product.status;
    product.seoTitle = seoTitle !== undefined ? seoTitle : product.seoTitle;
    product.seoDescription = seoDescription !== undefined ? seoDescription : product.seoDescription;
    product.categoryId = categoryId !== undefined ? (categoryId ? parseInt(categoryId) : null) : product.categoryId;
    product.brandId = brandId !== undefined ? (brandId ? parseInt(brandId) : null) : product.brandId;
    
    product.countdownTimerProfile = countdownTimerProfile !== undefined ? countdownTimerProfile : product.countdownTimerProfile;
    product.whenAchievingGoal = whenAchievingGoal !== undefined ? whenAchievingGoal : product.whenAchievingGoal;
    product.taxStatus = taxStatus !== undefined ? taxStatus : product.taxStatus;
    product.taxClass = taxClass !== undefined ? taxClass : product.taxClass;
    product.hsnSacCode = hsnSacCode !== undefined ? hsnSacCode : product.hsnSacCode;
    product.whatsAppNumber = whatsAppNumber !== undefined ? whatsAppNumber : product.whatsAppNumber;
    product.callToAction = callToAction !== undefined ? callToAction : product.callToAction;
    product.preFilledMessage = preFilledMessage !== undefined ? preFilledMessage : product.preFilledMessage;
    product.displaySettings = displaySettings !== undefined ? displaySettings : product.displaySettings;

    if (countdownEvergreen !== undefined) {
      product.countdownEvergreen = countdownEvergreen === 'true' || countdownEvergreen === true;
    }
    if (enableProgressBar !== undefined) {
      product.enableProgressBar = enableProgressBar === 'true' || enableProgressBar === true;
    }
    if (restartCountdownAfter !== undefined) {
      product.restartCountdownAfter = restartCountdownAfter ? parseInt(restartCountdownAfter) : null;
    }
    if (goal !== undefined) {
      product.goal = goal ? parseInt(goal) : null;
    }
    if (initialQuantity !== undefined) {
      product.initialQuantity = initialQuantity ? parseInt(initialQuantity) : null;
    }

    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    // Set new stock
    if (stockQuantity !== undefined) {
      const newStockVal = parseInt(stockQuantity);
      if (newStockVal !== oldStock) {
        product.stockQuantity = newStockVal;
        
        // Log the inventory stock diff
        const diff = newStockVal - oldStock;
        await InventoryLog.create({
          productId: product.id,
          stockChanged: diff,
          actionType: 'correction',
          reference: 'Admin stock inventory adjustment',
          adminId: req.admin.id
        });
      }
    }

    // Set new thumbnail if uploaded
    if (req.files && req.files.thumbnail) {
      product.thumbnail = `/uploads/products/${req.files.thumbnail[0].filename}`;
    }

    // Parse and update variants
    if (variants !== undefined) {
      let parsedVariants = variants;
      if (typeof variants === 'string') {
        try {
          parsedVariants = JSON.parse(variants);
        } catch (err) {
          parsedVariants = product.variants;
        }
      }
      product.variants = parsedVariants;
    }

    await product.save();

    // Create additional product gallery images if uploaded
    if (req.files && req.files.images) {
      const imageRecords = req.files.images.map((img) => ({
        productId: product.id,
        imageUrl: `/uploads/products/${img.filename}`
      }));
      await ProductImage.bulkCreate(imageRecords);
    }

    // Log Admin action
    await AdminLog.create({
      adminId: req.admin.id,
      action: `Updated product details: ${product.name}`,
      entityType: 'product',
      entityId: product.id,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const prodName = product.name;
    const prodId = product.id;

    await product.destroy(); // ProductImages cascade triggers automatically due to index associations

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Deleted product: ${prodName}`,
      entityType: 'product',
      entityId: prodId,
      ipAddress: req.ip
    });

    res.json({
      success: true,
      message: 'Product successfully removed from catalog'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete Product Image
// @route   DELETE /api/products/:id/images/:imageId
// @access  Private
const deleteProductImage = async (req, res, next) => {
  try {
    const { id, imageId } = req.params;
    
    // Ensure product exists
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const image = await ProductImage.findOne({ where: { id: imageId, productId: id } });
    if (!image) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }

    await image.destroy();

    await AdminLog.create({
      adminId: req.admin.id,
      action: `Deleted image ${imageId} from product: ${product.name}`,
      entityType: 'product',
      entityId: product.id,
      ipAddress: req.ip
    });

    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
};
