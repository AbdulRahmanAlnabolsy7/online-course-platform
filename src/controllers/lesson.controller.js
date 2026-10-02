const Lesson = require('../models/Lesson');
const Comment = require('../models/Comment');
const LessonProgress = require('../models/LessonProgress');
const Enrollment = require('../models/Enrollment');
const access = require('../services/access');
const ApiError = require('../utils/ApiError');
const { ok } = require('../utils/response');
const nestedLesson = async (req) => {
  const lesson = await Lesson.findOne({ _id: req.params.lessonId, course: req.params.courseId });
  if (!lesson) throw new ApiError(404, 'Lesson not found in this course');
  return lesson;
};
exports.list = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const canLearn = course.instructor.equals(req.user?._id) || (req.user && await Enrollment.exists({ course: course._id, student: req.user._id }));
  const lessons = await Lesson.find({ course: course._id }).sort({ order: 1 }).lean();
  ok(res, lessons.map(lesson => {
    if (canLearn || lesson.isPreview) return lesson;
    const { content, videoUrl, ...metadata } = lesson;
    return metadata;
  }));
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  if (!lesson.isPreview) await access.learning(course, req.user);
  ok(res, lesson);
};
exports.create = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  ok(res, await Lesson.create({ ...req.validated.body, course: req.params.courseId }), 'Lesson created', 201);
};
exports.update = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  Object.assign(lesson, req.validated.body);
  ok(res, await lesson.save(), 'Lesson updated');
};
exports.remove = async (req, res) => {
  await access.ownedCourse(req.params.courseId, req.user);
  const lesson = await nestedLesson(req);
  await Promise.all([Comment.deleteMany({ lesson: lesson._id }), LessonProgress.deleteMany({ lesson: lesson._id })]);
  await lesson.deleteOne();
  res.status(204).end();
};
