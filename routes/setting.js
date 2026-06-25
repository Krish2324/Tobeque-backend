const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, getPublicSettings } = require('../controllers/setting.controller');
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/public', getPublicSettings);

router.use(protect);

router.get('/', getSettings);
router.post('/', upload.single('logo'), updateSettings);

module.exports = router;
