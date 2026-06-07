const { Setting, AdminLog } = require('../models');

// @desc    Get All System Settings
// @route   GET /api/settings
// @access  Private
const getSettings = async (req, res, next) => {
  try {
    const settingsList = await Setting.findAll();
    
    // Convert array of key-value records into a flat JSON object!
    const settings = {};
    settingsList.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Site Settings
// @route   POST /api/settings
// @access  Private
const updateSettings = async (req, res, next) => {
  try {
    const settingsPayload = req.body; // e.g. { site_name: "Tobeque Core", currency: "USD" }

    // Upload new logo if provided
    if (req.file) {
      settingsPayload['site_logo'] = `/uploads/site/${req.file.filename}`;
    }

    for (const key of Object.keys(settingsPayload)) {
      const [settingRecord] = await Setting.findOrCreate({ where: { key } });
      settingRecord.value = settingsPayload[key] !== null ? settingsPayload[key].toString() : '';
      await settingRecord.save();
    }

    await AdminLog.create({
      adminId: req.admin.id,
      action: 'Updated global site parameters and SMTP/integrations configurations',
      entityType: 'settings',
      ipAddress: req.ip
    });

    // Re-fetch flat settings
    const settingsList = await Setting.findAll();
    const settings = {};
    settingsList.forEach(s => {
      settings[s.key] = s.value;
    });

    res.json({
      success: true,
      message: 'Global settings updated successfully',
      settings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
