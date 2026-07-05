const express = require('express');
const router = Router = express.Router();
const { getCustomers, getCustomerById, toggleCustomerStatus, deleteCustomer } = require('../controllers/customer.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.put('/:id/status', toggleCustomerStatus);
router.delete('/:id', deleteCustomer);

module.exports = router;
