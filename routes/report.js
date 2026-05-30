const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/report.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/sales', getSalesReport);

module.exports = router;
