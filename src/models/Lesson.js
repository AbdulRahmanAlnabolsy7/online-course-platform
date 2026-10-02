const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true, maxlength: 50000 },
  videoUrl: String,
  duration: { type: Number, min: 0, default: 0 },
  order: { type: Number, min: 1, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  isPreview: { type: Boolean, default: false }
}, { timestamps: true });
schema.index({ course: 1, order: 1 }, { unique: true });
module.exports = mongoose.model('Lesson', schema);
