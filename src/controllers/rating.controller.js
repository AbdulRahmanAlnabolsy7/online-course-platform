const Rating = require('../models/Rating');
const access = require('../services/access');
const ratings = require('../services/ratings');
const ApiError = require('../utils/ApiError');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  await access.course(req.params.courseId, req.user);
  await paginate(res, Rating, { course: req.params.courseId }, req.validated.query, { populate: { path: 'student', select: 'name avatar' } });
};
const context = async (req) => {
  const course = await access.course(req.params.courseId, req.user);
  await access.enrolled(course._id, req.user);
  return course;
};
exports.create = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.create({ ...req.validated.body, course: course._id, student: req.user._id });
  await ratings.refresh(course._id);
  ok(res, rating, 'Rating created', 201);
};
exports.update = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.findOneAndUpdate({ course: course._id, student: req.user._id }, req.validated.body, { new: true, runValidators: true });
  if (!rating) throw new ApiError(404, 'Rating not found');
  await ratings.refresh(course._id);
  ok(res, rating, 'Rating updated');
};
exports.remove = async (req, res) => {
  const course = await context(req);
  const rating = await Rating.findOneAndDelete({ course: course._id, student: req.user._id });
  if (!rating) throw new ApiError(404, 'Rating not found');
  await ratings.refresh(course._id);
  res.status(204).end();
};
