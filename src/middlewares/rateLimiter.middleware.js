const { RateLimiterRedis } = require("rate-limiter-flexible");
const redis = require("../../src/config/redisConfig");

// 🔥 1. IP-based rate limiter
const ipLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 20, // Max 20 requests
  duration: 60, // Per 60 seconds
});

// 🔥 2. Email-based rate limiter
const emailLimiter = new RateLimiterRedis({
  storeClient: redis,
  points: 5, // Max 5 attempts per email
  duration: 60, // Per 60 seconds
});

// 🔥 3. Account lockout for 15 minutes
const blockEmail = new RateLimiterRedis({
  storeClient: redis,
  points: 15, // 15 point means one block allowed
  duration: 60 * 15, // 15 minutes
});

module.exports = async function (req, res, next) {
  try {
    const ip = req.ip;
    const email = req.body.email;

    // 1️⃣ Check if the email is already blocked
    const blockData = await blockEmail.get(email);
    if (blockData && blockData.remainingPoints <= 0) {
      return res.status(429).json({
        success: false,
        message:
          "Too many failed attempts. Your account is locked for 15 minutes.",
      });
    }

    // 2️⃣ Limit based on IP address
    await ipLimiter.consume(ip);

    // 3️⃣ Limit based on email address
    await emailLimiter.consume(email);

    // If everything is fine → continue to next middleware
    next();
  } catch (error) {
    if (!(error instanceof Error)) {
      const email = req.body.email;
      await blockEmail.consume(email); // Block account for 15 min
    }
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Try again later.",
    });
  }
};
