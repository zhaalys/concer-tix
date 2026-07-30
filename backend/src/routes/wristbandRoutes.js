const express = require("express");
const router = express.Router();
const wristbandController = require("../controllers/wristbandController");

router.post("/", wristbandController.createWristbandOrder);
router.get("/history", wristbandController.getWristbandOrderHistory);
router.post("/payment-token", wristbandController.createWristbandPaymentToken);
router.get("/:code", wristbandController.getWristbandOrderByCode);
router.patch("/:code/status", wristbandController.updateWristbandOrderStatus);

module.exports = router;
