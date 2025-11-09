const { loginService, registerService,logoutService } = require("../service/auth.service");

const login = async (req, res) => {
  try {
    const data = await loginService(req.body);
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
const register = async (req, res) => {
  try {
    const data = await registerService(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const logout = async (req, res) => {
  try {
    const data = await logoutService();
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  login,
  register,
  logout,
};
