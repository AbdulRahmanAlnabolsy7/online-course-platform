const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const ApiError = require('../utils/ApiError');
exports.course = async (id, user) => {
  const course = await Course.findById(id);
  if (!course || (!course.isPublished && !course.instructor.equals(user?._id))) throw new ApiError(404, 'Course not found');
  return course;
};
exports.ownedCourse = async (id, user) => {
  const course = await Course.findById(id);
  if (!course) throw new ApiError(404, 'Course not found');
  if (!course.instructor.equals(user._id)) throw new ApiError(403, 'Only the course owner can perform this action');
  return course;
};
exports.enrolled = async (courseId, user) => {
  const enrollment = await Enrollment.findOne({ course: courseId, student: user._id });
  if (!enrollment) throw new ApiError(403, 'Course enrollment required');
  return enrollment;
};
exports.lesson = async (id, user) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) throw new ApiError(404, 'Lesson not found');
  const course = await exports.course(lesson.course, user);
  return { lesson, course };
};
exports.learning = async (course, user) => {
  if (course.instructor.equals(user?._id)) return;
  if (!user) throw new ApiError(401, 'Authentication required');
  await exports.enrolled(course._id, user);
};
