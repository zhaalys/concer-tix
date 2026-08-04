const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { requireAdmin, requireSuperAdmin } = require("../middlewares/adminAuth");

router.use(requireAdmin);

router.get("/overview", adminController.getOverview);
router.get("/orders", adminController.listOrders);
router.put("/orders/:id", adminController.updateOrder);

router.get("/payments", adminController.listPayments);
router.put("/payments/:id/status", adminController.updatePaymentStatus);

router.get("/events", adminController.listEvents);
router.get("/events/:id", adminController.getEvent);
router.post("/events", adminController.createEvent);
router.put("/events/:id", adminController.updateEvent);
router.delete("/events/:id", adminController.deleteEvent);
router.post("/upload", adminController.uploadImage);

router.get("/notifications", adminController.listNotifications);
router.get("/notifications/:id", adminController.getNotification);
router.post("/notifications", adminController.createNotification);
router.put("/notifications/:id", adminController.updateNotification);
router.delete("/notifications/:id", adminController.deleteNotification);

router.post("/checkin", adminController.checkIn);
router.get("/checkin-logs", adminController.listCheckinLogs);

router.get("/users", requireSuperAdmin, adminController.listUsers);
router.get("/admins", requireSuperAdmin, adminController.listAdmins);
router.post("/admins", requireSuperAdmin, adminController.addAdmin);
router.delete("/admins/:id", requireSuperAdmin, adminController.removeAdmin);

module.exports = router;
