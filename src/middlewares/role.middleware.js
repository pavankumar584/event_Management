/**
 * Role-based access middleware
 * Allows only users with the specified roles to proceed
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Access denied. Invalid token or user." });
      }
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      res.status(500).json({ message: "Authorization failed" });
    }
  };
};

module.exports = roleMiddleware;
