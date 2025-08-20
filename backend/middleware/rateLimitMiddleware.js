import rateLimit from '../config/rateLimit.js';

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit('rate-limit-id');

    if (!success) {
      return res
        .status(429)
        .json({ error: 'Exceeded request Limit. Please try again after a minute' });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default rateLimitMiddleware;
