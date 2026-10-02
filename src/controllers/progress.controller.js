const Lesson = require('../models/Lesson');
const LessonProgress = require('../models/LessonProgress');
const access = require('../services/access');
const { ok } = require('../utils/response');
const summary = async (courseId, student) => {
  const lessons = await Lesson.find({ course: courseId }).select('_id').lean();
  const completions = await LessonProgress.find({ student, course: courseId, lesson: { $in: lessons.map(l => l._id) } }).select('lesson').lean();
  const completedLessonIds = completions.map(item => item.lesson);
  const completedLessons = completedLessonIds.length;
  const totalLessons = lessons.length;
  return { courseId, completedLessons, totalLessons, completedLessonIds, progressPercentage: totalLessons ? Math.round(completedLessons / totalLessons * 10000) / 100 : 0 };
};
exports.get = async (req, res) => {
  const course = await access.course(req.params.courseId, req.user);
  await access.enrolled(course._id, req.user);
  ok(res, await summary(course._id, req.user._id));
};
exports.update = async (req, res) => {
  const { lesson, course } = await access.lesson(req.params.lessonId, req.user);
  await access.enrolled(course._id, req.user);
  const filter = { student: req.user._id, lesson: lesson._id };
  if (req.validated.body.completed) {
    await LessonProgress.updateOne(filter, { $setOnInsert: { ...filter, course: course._id } }, { upsert: true, runValidators: true });
  } else await LessonProgress.deleteOne(filter);
  ok(res, await summary(course._id, req.user._id), 'Progress updated');
};
