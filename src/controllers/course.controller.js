const mongoose = require('mongoose');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const Comment = require('../models/Comment');
const Rating = require('../models/Rating');
const LessonProgress = require('../models/LessonProgress');
const access = require('../services/access');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  const q = req.validated.query;
  const filter = { isPublished: true };
  for (const key of ['category', 'instructor', 'level']) if (q[key]) filter[key] = q[key];
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    filter.price = {};
    if (q.minPrice !== undefined) filter.price.$gte = q.minPrice;
    if (q.maxPrice !== undefined) filter.price.$lte = q.maxPrice;
  }
  if (q.minRating !== undefined) filter.averageRating = { $gte: q.minRating };
  if (q.search) {
    const escaped = q.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { description: { $regex: escaped, $options: 'i' } }];
  }
  const sorts = { newest: { createdAt: -1 }, rating: { averageRating: -1 }, price: { price: 1 },
    '-price': { price: -1 }, title: { title: 1 }, '-title': { title: -1 },
    '-createdAt': { createdAt: -1 }, '-averageRating': { averageRating: -1 } };
  await paginate(res, Course, filter, q, { sort: { ...sorts[q.sort], _id: 1 }, populate: { path: 'instructor', select: 'name avatar' } });
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  await course.populate('instructor', 'name avatar');
  ok(res, course);
};
exports.create = async (req, res) => ok(res, await Course.create({ ...req.validated.body, instructor: req.user._id }), 'Course created', 201);
exports.update = async (req, res) => {
  const course = await access.ownedCourse(req.params.courseId, req.user);
  Object.assign(course, req.validated.body);
  ok(res, await course.save(), 'Course updated');
};
exports.remove = async (req, res) => {
  const course = await access.ownedCourse(req.params.courseId, req.user);
  const lessons = await Lesson.find({ course: course._id }).select('_id');
  await Comment.deleteMany({ lesson: { $in: lessons.map(l => l._id) } });
  await Promise.all([Lesson.deleteMany({ course: course._id }), Enrollment.deleteMany({ course: course._id }),
    Rating.deleteMany({ course: course._id }), LessonProgress.deleteMany({ course: course._id })]);
  await course.deleteOne();
  res.status(204).end();
};
exports.mine = async (req, res) => paginate(res, Course, { instructor: req.user._id }, req.validated.query);
exports.categories = async (req, res) => ok(res, await Course.distinct('category', { isPublished: true }));
exports.stats = async (req, res) => {
  const courses = await Course.aggregate([
    { $match: { instructor: new mongoose.Types.ObjectId(req.user.id) } },
    { $lookup: { from: 'enrollments', let: { courseId: '$_id' }, pipeline: [
      { $match: { $expr: { $eq: ['$course', '$$courseId'] } } }, { $count: 'count' }
    ], as: 'enrollmentSummary' } },
    { $project: { title: 1, averageRating: 1, ratingsCount: 1,
      enrollments: { $ifNull: [{ $arrayElemAt: ['$enrollmentSummary.count', 0] }, 0] } } },
    { $sort: { enrollments: -1, _id: 1 } }
  ]);
  const ratingsCount = courses.reduce((n, c) => n + c.ratingsCount, 0);
  ok(res, { numberOfCourses: courses.length, totalEnrollments: courses.reduce((n, c) => n + c.enrollments, 0),
    averageCourseRating: ratingsCount ? courses.reduce((n, c) => n + c.averageRating * c.ratingsCount, 0) / ratingsCount : 0,
    mostPopularCourse: courses[0] || null, courses });
};
