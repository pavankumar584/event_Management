const {
  getProfileService,
  updateProfileService,
  bookingService,
  bookingHistoryService
} = require("../service/user.service");

const getProfile = async (req, res) => {
  try {
    const data = await getProfileService(req.user.id);
    res.status(200).json({
      message: "Profile fetched successfully",
      user: data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const profilePic = req.file ? `/uploads/${req.file.filename}` : undefined;

    await updateProfileService(req.user.id, {
      name,
      email,
      profilePic,
    });

    res.status(200).json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const booking = async (req, res) => {
  try {
    const result = await bookingService(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const bookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await bookingHistoryService(userId);

    res.status(200).json({
      message: "Booking history fetched successfully.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  booking,
  bookingHistory,
};
