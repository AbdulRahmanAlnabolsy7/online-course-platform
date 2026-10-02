const Enrollment = require('../models/Enrollment');
const LessonProgress = require('../models/LessonProgress');
const Rating = require('../models/Rating');
const access = require('../services/access');
const ratings = require('../services/ratings');
const { ok, paginate } = require('../utils/response');
exports.create = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  ok(res, await Enrollment.create({ course: course._id, student: req.user._id }), 'Enrolled successfully', 201);
};
exports.mine = async (req, res) => paginate(res, Enrollment, { student: req.user._id }, req.validated.query,
  { sort: { enrolledAt: -1, _id: -1 }, populate: { path: 'course', populate: { path: 'instructor', select: 'name avatar' } } });
exports.status = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  ok(res, { enrolled: Boolean(await Enrollment.exists({ student: req.user._id, course: course._id })) });
};
exports.remove = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const enrollment = await access.enrolled(course._id, req.user);
  await Promise.all([LessonProgress.deleteMany({ student: req.user._id, course: course._id }),
    Rating.deleteOne({ student: req.user._id, course: course._id })]);
  await enrollment.deleteOne();
  await ratings.refresh(course._id);
  res.status(204).end();
};
