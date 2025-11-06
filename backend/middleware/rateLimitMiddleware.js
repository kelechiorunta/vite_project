import rateLimit from '../config/rateLimit.js';

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const { success } = await rateLimit.limit(req.user?._id);

    const isAllowedRequests = req.url.includes('/proxy/chat-pictures') || req.url.includes('/graphql');

    if (!success && !isAllowedRequests) {
      return res
        .status(429)
        .json({ error: 'Rate Limit Exceeded! Please try again after a minute or two!' });
    }
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default rateLimitMiddleware;
