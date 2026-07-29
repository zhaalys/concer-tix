const express = require('express');
const router = express.Router();
const eventRoutes = require('./eventRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/events', eventRoutes);
router.use('/payment', paymentRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
