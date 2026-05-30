const express = require('express');
const router = express.Router();
const { getOrders, getOrderById, updateOrderStatus, getInvoiceDetails } = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.get('/:id/invoice', getInvoiceDetails);

module.exports = router;
