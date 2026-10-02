const env = require('../src/config/env');
const connect = require('../src/config/db');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Course = require('../src/models/Course');
const Lesson = require('../src/models/Lesson');
async function seed() {
  if (env.NODE_ENV === 'production') throw new Error('Demo seed is disabled in production');
  await connect(env.MONGO_URI);
  let instructor = await User.findOne({ email: 'instructor@example.com' });
  if (!instructor) instructor = await User.create({ name: 'Demo Instructor', email: 'instructor@example.com', password: 'DemoPass123!', role: 'instructor' });
  if (!await User.exists({ email: 'student@example.com' })) await User.create({ name: 'Demo Student', email: 'student@example.com', password: 'DemoPass123!', role: 'student' });
  let course = await Course.findOne({ title: 'Node.js Fundamentals', instructor: instructor._id });
  if (!course) course = await Course.create({ title: 'Node.js Fundamentals', description: 'Learn to build REST APIs.', instructor: instructor._id, category: 'programming', isPublished: true });
  for (let order = 1; order <= 3; order++) await Lesson.updateOne({ course: course._id, order }, { $setOnInsert: {
    title: ['Welcome', 'Express routing', 'MongoDB models'][order - 1], content: 'Demo lesson content for API exploration.', isPreview: order === 1, duration: 15
  } }, { upsert: true, runValidators: true });
  console.log('Demo data ready. instructor@example.com / student@example.com; password: DemoPass123!');
}
seed().catch(err => { console.error(err.message); process.exitCode = 1; }).finally(async () => mongoose.disconnect());
