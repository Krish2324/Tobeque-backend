const JobPosting = require('../models/jobPosting');
const { AdminLog } = require('../models');

// @desc    Get all active job postings
// @route   GET /api/job-postings/public
// @access  Public
exports.getActiveJobPostings = async (req, res, next) => {
  try {
    const jobs = await JobPosting.find({ status: 'Open' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all job postings (Admin)
// @route   GET /api/job-postings
// @access  Private (Admin)
exports.getJobPostings = async (req, res, next) => {
  try {
    const jobs = await JobPosting.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job posting
// @route   GET /api/job-postings/:id
// @access  Public
exports.getJobPosting = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job posting
// @route   POST /api/job-postings
// @access  Private (Admin)
exports.createJobPosting = async (req, res, next) => {
  try {
    const job = await JobPosting.create(req.body);
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Created job posting: ${job.title}`,
        entityType: 'jobPosting',
        entityId: job.id,
        ipAddress: req.ip
      });
    }
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job posting
// @route   PUT /api/job-postings/:id
// @access  Private (Admin)
exports.updateJobPosting = async (req, res, next) => {
  try {
    const job = await JobPosting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Updated job posting: ${job.title}`,
        entityType: 'jobPosting',
        entityId: job.id,
        ipAddress: req.ip
      });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job posting
// @route   DELETE /api/job-postings/:id
// @access  Private (Admin)
exports.deleteJobPosting = async (req, res, next) => {
  try {
    const job = await JobPosting.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    await job.deleteOne();
    if (req.admin) {
      await AdminLog.create({
        adminId: req.admin.id,
        action: `Deleted job posting: ${job.title}`,
        entityType: 'jobPosting',
        entityId: job.id,
        ipAddress: req.ip
      });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
