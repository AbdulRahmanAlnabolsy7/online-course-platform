const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 2000 }
}, { timestamps: true });
module.exports = mongoose.model('Comment', schema);
