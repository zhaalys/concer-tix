const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);
router.get("/history", orderController.getOrderHistory);
router.get("/:code", orderController.getOrderByCode);
router.patch("/:code/status", orderController.updateOrderStatus);

module.exports = router;
