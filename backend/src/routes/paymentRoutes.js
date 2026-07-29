const express = require('express');
const router = express.Router();
const { createToken } = require('../controllers/paymentController');

router.post('/token', createToken);

module.exports = router;
