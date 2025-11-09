const semver = require("semver");

const versionMiddleware = (versions) => {
  return (req, res, next) => {
    const clientVersion = req.headers["x-api-version"];
    if (!clientVersion) {
      return res.status(400).json({ message: "Missing API version header" });
    }

    const isSupported = versions.some((ver) =>
      semver.satisfies(clientVersion, ver)
    );
    if (!isSupported) {
      return res.status(426).json({
        message: `Unsupported API version. Supported versions: ${versions.join(
          ", "
        )}`,
      });
    }

    next();
  };
};

module.exports = versionMiddleware;
