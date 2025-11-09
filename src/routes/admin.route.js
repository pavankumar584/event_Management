const express = require("express");
const versionMiddleware = require("../middlewares/version.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  getAllUser,
  getUserById,
  getAllOrganizer,
  getOrganizerById,
  banUserIdByAdmin,
  unBanUserIdByAdmin,
  getAllBannedUsers,
  notifyWaitListUser,
  getAnalyticsDashboard
} = require("../controllers/admin.controller");

const router = express.Router();
router.get(
  "/getAllUser",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getAllUser
);

router.get(
  "/getUser/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getUserById
);

router.get(
  "/getAllOriganzer",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getAllOrganizer
);

router.get(
  "/getOriganzer/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getOrganizerById
);

router.post(
  "/ban-user/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  banUserIdByAdmin
);

router.get(
  "/banned-users",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getAllBannedUsers
);

router.post(
  "/unban-user/:id",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  unBanUserIdByAdmin
);

router.post(
  "/notify/:eventId",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  notifyWaitListUser
);

router.get(
  "/analytics/dashboard",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  adminMiddleware,
  getAnalyticsDashboard
);

module.exports = router;
