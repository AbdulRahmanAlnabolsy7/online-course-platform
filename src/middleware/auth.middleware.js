const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
exports.optionalAuth = async (req, res, next) => {
  const header = req.get('authorization');
  if (!header) return next();
  if (!/^Bearer \S+$/i.test(header)) throw new ApiError(401, 'Use a Bearer token');
  const payload = jwt.verify(header.split(' ')[1], env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'course-api', audience: 'course-client' });
  req.user = await User.findById(payload.sub);
  if (!req.user) throw new ApiError(401, 'User no longer exists');
  next();
};
exports.protect = (req, res, next) => {
  if (!req.user) throw new ApiError(401, 'Authentication required');
  next();
};
exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) throw new ApiError(403, 'Role is not permitted');
  next();
};
