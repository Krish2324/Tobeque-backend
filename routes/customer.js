const express = require('express');
const router = Router = express.Router();
const { getCustomers, getCustomerById, toggleCustomerStatus } = require('../controllers/customer.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id/status', toggleCustomerStatus);

module.exports = router;
