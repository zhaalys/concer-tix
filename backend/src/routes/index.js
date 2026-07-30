const express = require('express');
const router = express.Router();
const eventRoutes = require('./eventRoutes');
const paymentRoutes = require('./paymentRoutes');
const orderRoutes = require('./orderRoutes');
const wristbandRoutes = require('./wristbandRoutes');

router.use('/events', eventRoutes);
router.use('/payment', paymentRoutes);
router.use('/orders', orderRoutes);
router.use('/wristband-orders', wristbandRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
