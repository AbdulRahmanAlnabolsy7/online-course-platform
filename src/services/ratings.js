const Rating = require('../models/Rating');
const Course = require('../models/Course');
exports.refresh = async (courseId) => {
  // Cached aggregates are rebuilt from the rating collection after each mutation.
  const [summary] = await Rating.aggregate([
    { $match: { course: courseId } },
    { $group: { _id: '$course', averageRating: { $avg: '$value' }, ratingsCount: { $sum: 1 } } }
  ]);
  await Course.updateOne({ _id: courseId }, { $set: {
    averageRating: summary?.averageRating || 0, ratingsCount: summary?.ratingsCount || 0
  } });
};
