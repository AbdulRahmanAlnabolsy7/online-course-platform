const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now }
});
schema.index({ student: 1, course: 1 }, { unique: true });
schema.index({ course: 1 });
module.exports = mongoose.model('Enrollment', schema);
