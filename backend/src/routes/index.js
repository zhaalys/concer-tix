const express = require('express');
const router = express.Router();
const eventRoutes = require('./eventRoutes');

router.use('/events', eventRoutes);

router.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = router;
