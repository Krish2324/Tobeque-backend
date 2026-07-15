const Blog = require('../models/blog');
const { AdminLog } = require('../models');

// @desc    Get all blogs (Admin & Public)
// @route   GET /api/blogs
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID or Slug
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if ID is a valid ObjectId, otherwise treat it as a slug
    const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
    const query = isObjectId ? { _id: id } : { slug: id };

    const blog = await Blog.findOne(query);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private (Admin)
exports.createBlog = async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);

    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Created blog post: ${blog.title}`,
        entityType: 'blog',
        entityId: blog.id,
        ipAddress: req.ip
      });
    }

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'A blog post with this slug already exists' });
    }
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin)
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Updated blog post: ${blog.title}`,
        entityType: 'blog',
        entityId: blog.id,
        ipAddress: req.ip
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: 'A blog post with this slug already exists' });
    }
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    const title = blog.title;
    const blogId = blog.id;

    await blog.deleteOne();

    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Deleted blog post: ${title}`,
        entityType: 'blog',
        entityId: blogId,
        ipAddress: req.ip
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle blog status (Draft/Published)
// @route   PATCH /api/blogs/:id/status
// @access  Private (Admin)
exports.toggleStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const blog = await Blog.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true, runValidators: true }
    );

    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog post not found' });
    }

    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Changed blog status to ${status}: ${blog.title}`,
        entityType: 'blog',
        entityId: blog.id,
        ipAddress: req.ip
      });
    }

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload blog image
// @route   POST /api/blogs/upload-image
// @access  Private (Admin)
exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload an image file' });
    }
    
    // Cloudinary URL is attached to req.file.path by multer-storage-cloudinary
    res.status(200).json({
      success: true,
      data: {
        url: req.file.path
      }
    });
  } catch (error) {
    next(error);
  }
};
