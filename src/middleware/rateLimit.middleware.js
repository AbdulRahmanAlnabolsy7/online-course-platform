const { rateLimit } = require('express-rate-limit');
const message = { success: false, message: 'Too many requests. Try again later.' };
exports.apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-8', legacyHeaders: false, message });
exports.authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message });
