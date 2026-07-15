const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const {
  pushOrderToShiprocket,
  assignCourier,
  schedulePickup,
  generateLabel,
  generateManifest,
  trackShipment,
  cancelShiprocketOrder,
  checkOrderServiceability,
  getPickupAddresses,
  handleWebhook,
  getShiprocketOrderStatus
} = require('../controllers/shiprocket.controller');

// ─── Public Route (Webhook — no auth, verified by x-api-key) ─────────────────
// NOTE: Do NOT put the word "shiprocket" in the webhook URL per Shiprocket docs.
// Register this URL in Shiprocket: Settings > API > Webhooks
// URL: https://yourdomain.com/api/shipping/webhook
router.post('/webhook', handleWebhook);

// ─── Protected Routes (Admin only) ───────────────────────────────────────────
router.use(protect);

// Utility
router.get('/pickup-addresses', getPickupAddresses);

// Per-order Shiprocket flow
router.get('/orders/:id/status', getShiprocketOrderStatus);
router.get('/orders/:id/serviceability', checkOrderServiceability);
router.get('/orders/:id/track', trackShipment);

router.post('/orders/:id/push', pushOrderToShiprocket);
router.post('/orders/:id/assign-courier', assignCourier);
router.post('/orders/:id/schedule-pickup', schedulePickup);
router.post('/orders/:id/generate-label', generateLabel);
router.post('/orders/:id/generate-manifest', generateManifest);
router.post('/orders/:id/cancel', cancelShiprocketOrder);

module.exports = router;
