const express = require('express');
const router = express.Router();
const eventRoutes = require('./eventRoutes');
const paymentRoutes = require('./paymentRoutes');
const orderRoutes = require('./orderRoutes');
const wristbandRoutes = require('./wristbandRoutes');
const adminRoutes = require('./adminRoutes');
const webhookRoutes = require('./webhookRoutes');
const bannerRoutes = require('./bannerRoutes');

router.use('/events', eventRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/wristband-orders', wristbandRoutes);
router.use('/admin', adminRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/banners', bannerRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
