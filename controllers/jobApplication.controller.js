const JobApplication = require('../models/jobApplication');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Optional user auth — attach user if token present, otherwise continue as guest
const optionalUserAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtsecretkeyshouldbecomplex39284');
      if (decoded.type === 'user') {
        req.user = await User.findById(decoded.id).select('-password -otpCode -otpExpiry');
      }
    } catch (e) {
      // Ignore invalid tokens — allow guest submission
    }
  }
  next();
};

// @desc    Submit a job application (public — optionally authenticated)
// @route   POST /api/job-applications
// @access  Public
const submitApplication = async (req, res, next) => {
  try {
    const { jobTitle, fullName, email, phone, bio } = req.body;

    if (!jobTitle || !fullName || !email || !phone || !bio) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'CV/Resume file is required' });
    }

    const application = await JobApplication.create({
      jobTitle,
      fullName,
      email,
      phone,
      bio,
      cvUrl: req.file.filename ? `/uploads/cvs/${req.file.filename}` : req.file.path,
      cvOriginalName: req.file.originalname,
      userId: req.user ? req.user._id : null
    });

    res.status(201).json({ success: true, message: 'Application submitted successfully!', application });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job applications (admin)
// @route   GET /api/job-applications
// @access  Private (Admin)
const getApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'all') query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [applications, total] = await Promise.all([
      JobApplication.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'firstName lastName phone'),
      JobApplication.countDocuments(query)
    ]);

    res.json({ success: true, applications, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (admin)
// @route   PUT /api/job-applications/:id/status
// @access  Private (Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    next(error);
  }
};

const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// @desc    Delete application (admin)
// @route   DELETE /api/job-applications/:id
// @access  Private (Admin)
const deleteApplication = async (req, res, next) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    // Delete associated file
    if (application.cvUrl) {
      if (application.cvUrl.startsWith('/uploads/')) {
        // Local file
        const filePath = path.join(__dirname, '..', application.cvUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } else if (application.cvUrl.includes('cloudinary.com')) {
        // Cloudinary file
        try {
          // Extract public_id from Cloudinary URL (e.g. .../v1234567/tobeque/cvs/cv-xxx.pdf)
          const urlParts = application.cvUrl.split('/');
          const uploadIndex = urlParts.findIndex(part => part === 'upload');
          if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
            // Join the rest of the parts after version
            let publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
            // For raw files, Cloudinary needs the public_id WITH extension
            await cloudinary.uploader.destroy(publicIdWithExt, { resource_type: 'raw' });
          }
        } catch (err) {
          console.error('Failed to delete CV from Cloudinary:', err);
        }
      }
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Application and associated CV deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitApplication, getApplications, updateApplicationStatus, deleteApplication, optionalUserAuth };
