const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 10000 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  category: { type: String, required: true, lowercase: true, trim: true, index: true },
  price: { type: Number, min: 0, default: 0 },
  thumbnail: String,
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  tags: [String],
  isPublished: { type: Boolean, default: false },
  averageRating: { type: Number, min: 0, max: 5, default: 0 },
  ratingsCount: { type: Number, default: 0 }
}, { timestamps: true });
schema.index({ isPublished: 1, createdAt: -1 });
module.exports = mongoose.model('Course', schema);
