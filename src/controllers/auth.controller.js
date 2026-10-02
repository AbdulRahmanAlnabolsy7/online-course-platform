const jwt = require('jsonwebtoken');
const User = require('../models/User');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const token = (user) => jwt.sign({}, env.JWT_SECRET, { subject: user.id, expiresIn: env.JWT_EXPIRES_IN,
  algorithm: 'HS256', issuer: 'course-api', audience: 'course-client' });
exports.register = async (req, res) => {
  const user = await User.create(req.validated.body);
  ok(res, { user, token: token(user) }, 'Registered successfully', 201);
};
exports.login = async (req, res) => {
  const { email, password } = req.validated.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !await user.comparePassword(password)) throw new ApiError(401, 'Invalid email or password');
  ok(res, { user, token: token(user) }, 'Logged in successfully');
};
exports.me = async (req, res) => ok(res, req.user);
