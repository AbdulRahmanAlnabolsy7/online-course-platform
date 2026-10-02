const Joi = require('joi');
const id = Joi.string().pattern(/^[a-fA-F0-9]{24}$/);
const text = (max) => Joi.string().trim().min(1).max(max);
const url = Joi.string().uri({ scheme: ['http', 'https'] });
const course = {
  title: text(200), description: text(10000), category: text(60).lowercase().pattern(/^[a-z0-9-]+$/),
  price: Joi.number().min(0).max(1000000), thumbnail: url,
  level: Joi.string().valid('beginner', 'intermediate', 'advanced'),
  tags: Joi.array().items(text(40).lowercase()).max(20), isPublished: Joi.boolean()
};
const lesson = { title: text(200), content: text(50000), videoUrl: url,
  duration: Joi.number().min(0).max(100000), order: Joi.number().integer().min(1), isPreview: Joi.boolean() };
exports.params = (...names) => Joi.object(Object.fromEntries(names.map(name => [name, id.required()])));
exports.register = Joi.object({ name: text(100).required(), email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).max(72).custom((v, h) => Buffer.byteLength(v, 'utf8') > 72 ? h.error('any.invalid') : v).required(),
  role: Joi.string().valid('student', 'instructor').required(), avatar: url });
exports.login = Joi.object({ email: Joi.string().email().lowercase().required(), password: Joi.string().max(200).required() });
exports.createCourse = Joi.object({ ...course, title: course.title.required(), description: course.description.required(), category: course.category.required() });
exports.updateCourse = Joi.object(course).min(1);
exports.createLesson = Joi.object({ ...lesson, title: lesson.title.required(), content: lesson.content.required(), order: lesson.order.required() });
exports.updateLesson = Joi.object(lesson).min(1);
exports.comment = Joi.object({ text: text(2000).required() });
exports.rating = Joi.object({ value: Joi.number().integer().min(1).max(5).required(), review: text(2000).allow('') });
exports.progress = Joi.object({ completed: Joi.boolean().required() });
const paging = { page: Joi.number().integer().min(1).max(100000).default(1), limit: Joi.number().integer().min(1).max(100).default(10) };
exports.paging = Joi.object(paging);
exports.courseQuery = Joi.object({ ...paging, category: course.category, instructor: id, level: course.level,
  search: text(100), minPrice: Joi.number().min(0), maxPrice: Joi.number().min(Joi.ref('minPrice', { adjust: v => v || 0 })),
  minRating: Joi.number().min(0).max(5),
  sort: Joi.string().valid('newest', 'rating', 'price', '-price', 'title', '-title', '-createdAt', '-averageRating').default('newest') });
