const express = require("express");
const { authMiddleware } = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const upload = require("../middlewares/upload.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const versionMiddleware = require("../middlewares/version.middleware");
const {
  getProfile,
  updateProfile,
  booking,
  bookingHistory
} = require("../controllers/user.controller");
const updateProfileValidation = require("../validation/user/updateuser.validation");
const BookingValidation = require("../validation/books/booking.validation");

const router = express.Router();

router.get(
  "/getProfile",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  getProfile
);

router.put(
  "/updateProfile",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  upload.single("profilePic"),
  validationMiddleware(updateProfileValidation, "body"),
  updateProfile
);

router.post(
  "/booking",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  validationMiddleware(BookingValidation, "body"),
  booking
);
router.get(
  "/booking-history",
  versionMiddleware(["1.0.0"]),
  authMiddleware,
  bookingHistory
);
module.exports = router;
