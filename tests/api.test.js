process.env.NODE_ENV = 'test';
process.env.MONGO_URI = 'mongodb://127.0.0.1/course_test';
process.env.JWT_SECRET = 'test-secret-only-at-least-thirty-two-characters';
process.env.MONGOMS_DOWNLOAD_DIR = require('path').resolve(__dirname, '../node_modules/.cache/mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const connect = require('../src/config/db');
let mongo, instructor, otherInstructor, student, otherStudent, courseId, lessonId, commentId;
const call = (method, path, token, body) => {
  let req = request(app)[method]('/api/v1' + path);
  if (token) req = req.set('Authorization', `Bearer ${token}`);
  return body === undefined ? req : req.send(body);
};
const register = async (email, role) => {
  const res = await call('post', '/auth/register', null, { name: role, email, role, password: 'Password123!' });
  expect(res.status).toBe(201);
  expect(res.body.data.user.password).toBeUndefined();
  return res.body.data.token;
};
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await connect(mongo.getUri());
  await Promise.all(Object.values(mongoose.models).map(m => m.init()));
}, 1200000);
afterAll(async () => { await mongoose.disconnect(); if (mongo) await mongo.stop(); });
test('register users; normalize email; reject duplicate registration and invalid input', async () => {
  instructor = await register('INSTRUCTOR@example.com', 'instructor');
  otherInstructor = await register('other-instructor@example.com', 'instructor');
  student = await register('student@example.com', 'student');
  otherStudent = await register('other-student@example.com', 'student');
  expect((await call('post', '/auth/register', null, { name: 'Duplicate', email: 'instructor@example.com', role: 'student', password: 'Password123!' })).status).toBe(409);
  expect((await call('post', '/auth/register', null, { role: 'admin' })).status).toBe(422);
});
test('login and JWT protection never expose passwords', async () => {
  const login = await call('post', '/auth/login', null, { email: 'student@example.com', password: 'Password123!' });
  expect(login.status).toBe(200);
  expect(login.body.data.user.password).toBeUndefined();
  expect((await call('post', '/auth/login', null, { email: 'student@example.com', password: 'wrong' })).status).toBe(401);
  expect((await call('get', '/auth/me')).status).toBe(401);
  expect((await call('get', '/auth/me', 'invalid')).status).toBe(401);
  const me = await call('get', '/auth/me', student);
  expect(me.status).toBe(200);
  expect(me.body.data.password).toBeUndefined();
});
test('only instructor creates course; only owner updates it; validate IDs and input', async () => {
  const body = { title: 'Node.js Basics', description: 'Backend programming', category: 'programming', isPublished: true, price: 10 };
  expect((await call('post', '/courses', student, body)).status).toBe(403);
  const created = await call('post', '/courses', instructor, body);
  expect(created.status).toBe(201); courseId = created.body.data._id;
  expect((await call('patch', `/courses/${courseId}`, otherInstructor, { title: 'Stolen' })).status).toBe(403);
  expect((await call('patch', `/courses/${courseId}`, instructor, { title: 'Node.js Advanced' })).status).toBe(200);
  expect((await call('get', '/courses/bad-id')).status).toBe(422);
  expect((await call('patch', `/courses/${courseId}`, instructor, { instructor: '123' })).status).toBe(422);
});
test('lesson ownership, unique order, nested IDs and protected content', async () => {
  const body = { title: 'First lesson', content: 'Protected content', order: 1 };
  expect((await call('post', `/courses/${courseId}/lessons`, otherInstructor, body)).status).toBe(403);
  const created = await call('post', `/courses/${courseId}/lessons`, instructor, body);
  expect(created.status).toBe(201); lessonId = created.body.data._id;
  expect((await call('post', `/courses/${courseId}/lessons`, instructor, body)).status).toBe(409);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`)).status).toBe(401);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`, student)).status).toBe(403);
  const list = await call('get', `/courses/${courseId}/lessons`);
  expect(list.body.data[0].content).toBeUndefined();
  expect((await call('patch', `/courses/${courseId}/lessons/${lessonId}`, otherInstructor, { title: 'Stolen' })).status).toBe(403);
});
test('enrollment is student only and unique', async () => {
  expect((await call('post', `/courses/${courseId}/enroll`, instructor)).status).toBe(403);
  expect((await call('post', `/courses/${courseId}/enroll`, student)).status).toBe(201);
  expect((await call('post', `/courses/${courseId}/enroll`, student)).status).toBe(409);
  expect((await call('get', `/courses/${courseId}/enrollment-status`, student)).body.data.enrolled).toBe(true);
  expect((await call('get', '/enrollments/me', student)).body.data).toHaveLength(1);
  expect((await call('get', `/courses/${courseId}/lessons/${lessonId}`, student)).body.data.content).toBe('Protected content');
});
test('comments require enrollment and only owner can edit/delete', async () => {
  expect((await call('post', `/lessons/${lessonId}/comments`, otherStudent, { text: 'No access' })).status).toBe(403);
  const created = await call('post', `/lessons/${lessonId}/comments`, student, { text: 'Helpful' });
  expect(created.status).toBe(201); commentId = created.body.data._id;
  expect(created.body.data.user.name).toBeDefined();
  expect((await call('patch', `/comments/${commentId}`, otherStudent, { text: 'Stolen' })).status).toBe(403);
  expect((await call('delete', `/comments/${commentId}`, otherStudent)).status).toBe(403);
  expect((await call('patch', `/comments/${commentId}`, student, { text: 'Updated' })).status).toBe(200);
  expect((await call('get', `/lessons/${lessonId}/comments?page=1&limit=1`, student)).body.pagination.totalItems).toBe(1);
});
test('ratings require enrollment; uniqueness, bounds and aggregates update', async () => {
  expect((await call('post', `/courses/${courseId}/ratings`, otherStudent, { value: 5 })).status).toBe(403);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 6 })).status).toBe(422);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 5 })).status).toBe(201);
  expect((await call('post', `/courses/${courseId}/ratings`, student, { value: 4 })).status).toBe(409);
  expect((await call('get', `/courses/${courseId}`)).body.data.averageRating).toBe(5);
  expect((await call('patch', `/courses/${courseId}/ratings/me`, student, { value: 3 })).status).toBe(200);
  expect((await call('get', `/courses/${courseId}`)).body.data.averageRating).toBe(3);
  expect((await call('delete', `/courses/${courseId}/ratings/me`, student)).status).toBe(204);
  const course = await call('get', `/courses/${courseId}`);
  expect(course.body.data.averageRating).toBe(0); expect(course.body.data.ratingsCount).toBe(0);
});
test('completion is idempotent, reversible, and restricted to enrolled students', async () => {
  expect((await call('patch', `/lessons/${lessonId}/progress`, otherStudent, { completed: true })).status).toBe(403);
  const result = await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true });
  expect(result.status).toBe(200); expect(result.body.data.progressPercentage).toBe(100);
  expect(result.body.data.completedLessonIds).toEqual([lessonId]);
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.completedLessonIds).toEqual([lessonId]);
  expect((await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true })).body.data.completedLessons).toBe(1);
  expect((await call('patch', `/lessons/${lessonId}/progress`, student, { completed: false })).body.data.progressPercentage).toBe(0);
  await call('patch', `/lessons/${lessonId}/progress`, student, { completed: true });
  await call('post', `/courses/${courseId}/lessons`, instructor, { title: 'Second', content: 'Second lesson', order: 2 });
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.progressPercentage).toBe(50);
});
test('search, filters, pagination, category list, analytics and malicious input', async () => {
  const search = await call('get', '/courses?search=node&category=programming&minPrice=0&maxPrice=20&sort=-averageRating&limit=1');
  expect(search.status).toBe(200); expect(search.body.pagination.totalItems).toBe(1);
  expect((await call('get', '/courses?search=%5B')).status).toBe(200);
  expect((await call('get', '/courses?page=0')).status).toBe(422);
  expect((await call('get', '/courses?minPrice=20&maxPrice=10')).status).toBe(422);
  expect((await call('post', '/auth/login', null, { email: { $ne: '' }, password: 'x' })).status).toBe(400);
  expect((await call('get', '/categories')).body.data).toContain('programming');
  const stats = await call('get', '/instructor/stats', instructor);
  expect(stats.status).toBe(200); expect(stats.body.data.totalEnrollments).toBe(1);
  expect((await call('get', '/instructor/stats', student)).status).toBe(403);
});
test('concurrent ratings produce consistent cached aggregates in a single process', async () => {
  await call('post', `/courses/${courseId}/enroll`, otherStudent);
  const results = await Promise.all([
    call('post', `/courses/${courseId}/ratings`, student, { value: 5 }),
    call('post', `/courses/${courseId}/ratings`, otherStudent, { value: 3 })
  ]);
  expect(results.map(r => r.status)).toEqual([201, 201]);
  const course = await call('get', `/courses/${courseId}`);
  expect(course.body.data.averageRating).toBe(4); expect(course.body.data.ratingsCount).toBe(2);
  await call('delete', `/courses/${courseId}/ratings/me`, student);
  await call('delete', `/courses/${courseId}/ratings/me`, otherStudent);
});
test('draft courses are owner only; public preview exposes only preview content', async () => {
  const draft = await call('post', '/courses', instructor, { title: 'Draft', description: 'Hidden', category: 'design' });
  const id = draft.body.data._id;
  expect((await call('get', `/courses/${id}`)).status).toBe(404);
  expect((await call('get', `/courses/${id}`, otherInstructor)).status).toBe(404);
  expect((await call('get', `/courses/${id}`, instructor)).status).toBe(200);
  expect((await call('post', `/courses/${id}/enroll`, student)).status).toBe(404);
  await call('post', `/courses/${courseId}/lessons`, instructor, { title: 'Preview', content: 'Free preview', order: 3, isPreview: true });
  const list = await call('get', `/courses/${courseId}/lessons`);
  expect(list.body.data.find(l => l.isPreview).content).toBe('Free preview');
  expect((await call('get', `/courses/${id}/lessons/${lessonId}`, instructor)).status).toBe(404);
});
test('Swagger, health, JSON parse errors and unknown routes are consistent', async () => {
  expect((await request(app).get('/health')).status).toBe(200);
  expect((await request(app).get('/api-docs/')).status).toBe(200);
  const docs = await request(app).get('/api-docs.json');
  expect(docs.body.openapi).toBe('3.0.3'); expect(Object.keys(docs.body.paths).length).toBeGreaterThan(15);
  const invalid = await request(app).post('/api/v1/auth/login').set('Content-Type', 'application/json').send('{');
  expect(invalid.status).toBe(400); expect(invalid.body.success).toBe(false);
  expect((await call('get', '/missing')).status).toBe(404);
});
test('unenrollment clears progress and rating; deletion cascades related records', async () => {
  await call('post', `/courses/${courseId}/ratings`, student, { value: 5 });
  expect((await call('delete', `/courses/${courseId}/enroll`, student)).status).toBe(204);
  expect((await call('get', `/courses/${courseId}/progress`, student)).status).toBe(403);
  expect((await call('get', `/courses/${courseId}`)).body.data.ratingsCount).toBe(0);
  await call('post', `/courses/${courseId}/enroll`, student);
  expect((await call('get', `/courses/${courseId}/progress`, student)).body.data.completedLessons).toBe(0);
  expect((await call('delete', `/courses/${courseId}`, instructor)).status).toBe(204);
  expect((await call('get', `/courses/${courseId}`)).status).toBe(404);
  expect(await mongoose.model('Lesson').countDocuments({ course: courseId })).toBe(0);
  expect(await mongoose.model('Enrollment').countDocuments({ course: courseId })).toBe(0);
  expect(await mongoose.model('Comment').countDocuments({ lesson: lessonId })).toBe(0);
});
