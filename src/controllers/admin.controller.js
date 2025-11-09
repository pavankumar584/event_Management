const {
  getAllUserService,
  getUserByIdService,
  getAllOrganizerService,
  getOrganizerByIdService,
  banUserIdByAdminService,
  unBanUserIdByAdminService,
  getAllBannedUsersService,
  notifyWaitlistUserService,
  getAnalyticsDashboardService,
} = require("../service/admin.service");

exports.getAllUser = async (req, res) => {
  try {
    const users = await getAllUserService();
    res.status(200).json({
      message: "Users fetched successfully!",
      users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully!",
      user,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAllOrganizer = async (req, res) => {
  try {
    const data = await getAllOrganizerService();
    res.status(200).json({ message: "Organizer fetch Successfully..!", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOrganizerById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getOrganizerByIdService(id);

    res.status(200).json({
      message: "Organizer fetched successfully by ID",
      data,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.banUserIdByAdmin = async (req, res) => {
  try {
    const ban = await banUserIdByAdminService({ userId: req.params.id });
    res.status(200).send(ban);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.unBanUserIdByAdmin = async (req, res) => {
  try {
    const unban = await unBanUserIdByAdminService({ userId: req.params.id });
    res.status(200).send(unban);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getAllBannedUsers = async (req, res) => {
  try {
    const bannedUser = await getAllBannedUsersService();
    res.status(200).send(bannedUser);
  } catch (error) {}
};

exports.notifyWaitListUser = async (req, res) => {
  try {
    const { eventId } = req.params;
    const notify = await notifyWaitlistUserService(eventId);
    res.status(200).json(notify);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.getAnalyticsDashboard = async (req, res) => {
  try {
    const result = await getAnalyticsDashboardService();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
