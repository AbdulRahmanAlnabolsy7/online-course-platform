const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, maxlength: 2000 }
}, { timestamps: true });
schema.index({ student: 1, course: 1 }, { unique: true });
schema.index({ course: 1 });
module.exports = mongoose.model('Rating', schema);
