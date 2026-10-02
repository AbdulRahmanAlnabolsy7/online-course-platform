const v = require('../validators');
function joiSchema(schema) {
  const convert = d => {
    const result = { type: d.type === 'number' ? 'number' : d.type === 'object' ? 'object' : d.type === 'array' ? 'array' : d.type === 'boolean' ? 'boolean' : 'string' };
    if (d.flags?.default !== undefined) result.default = d.flags.default;
    if (d.flags?.only) result.enum = d.allow;
    for (const rule of d.rules || []) {
      if (rule.name === 'integer') result.type = 'integer';
      if (rule.name === 'min' && typeof rule.args.limit === 'number') result[d.type === 'number' ? 'minimum' : 'minLength'] = rule.args.limit;
      if (rule.name === 'max' && typeof rule.args.limit === 'number') result[d.type === 'number' ? 'maximum' : 'maxLength'] = rule.args.limit;
      if (rule.name === 'email') result.format = 'email';
      if (rule.name === 'uri') result.format = 'uri';
    }
    if (d.keys) {
      result.properties = Object.fromEntries(Object.entries(d.keys).map(([k, s]) => [k, convert(s)]));
      result.required = Object.entries(d.keys).filter(([, s]) => s.flags?.presence === 'required').map(([k]) => k);
      result.additionalProperties = false;
    }
    if (d.items) result.items = convert(d.items[0]);
    return result;
  };
  return convert(schema.describe());
}
const paths = {};
const operations = [];
function add(method, path, tag, summary, schema, query, security = true, status = 200, example) {
  const parameters = [...path.matchAll(/\{(\w+)\}/g)].map(m => ({ name: m[1], in: 'path', required: true, schema: { type: 'string', pattern: '^[a-fA-F0-9]{24}$' } }));
  if (query) for (const [name, spec] of Object.entries(joiSchema(query).properties)) parameters.push({ name, in: 'query', schema: spec });
  const responses = {};
  for (const code of [status, 400, 401, 403, 404, 409, 422, 429, 500]) responses[code] = {
    description: code === status ? 'Successful operation' : 'Request failed',
    ...(code === 204 ? {} : { content: { 'application/json': { schema: { $ref: code === status ? '#/components/schemas/Success' : '#/components/schemas/Error' } } } })
  };
  const publicAuthEndpoint = path.startsWith('/auth/');
  const operation = { tags: [tag], summary, parameters,
    security: security ? [{ bearerAuth: [] }] : publicAuthEndpoint ? [] : [{}, { bearerAuth: [] }], responses };
  if (schema) operation.requestBody = { required: true, content: { 'application/json': { schema: joiSchema(schema), ...(example ? { example } : {}) } } };
  paths[path] = { ...paths[path], [method]: operation };
  operations.push({ method, path, tag, summary, example, security, status });
}
const courseExample = { title: 'Node.js Fundamentals', description: 'Build backend APIs with Node.js.', category: 'programming', price: 0, level: 'beginner', isPublished: true };
const lessonExample = { title: 'Introduction', content: 'Welcome to the course.', order: 1, duration: 10, isPreview: false };
add('post', '/auth/register', 'Auth', 'Register a student or instructor', v.register, null, false, 201, { name: 'Demo Instructor', email: 'instructor@example.com', password: 'DemoPass123!', role: 'instructor' });
add('post', '/auth/login', 'Auth', 'Login and receive a Bearer JWT', v.login, null, false, 200, { email: 'instructor@example.com', password: 'DemoPass123!' });
add('get', '/auth/me', 'Auth', 'Get current user');
add('get', '/categories', 'Courses', 'List categories used by published courses', null, null, false);
add('get', '/courses', 'Courses', 'Browse published courses', null, v.courseQuery, false);
add('post', '/courses', 'Courses', 'Create a course (instructor)', v.createCourse, null, true, 201, courseExample);
add('get', '/courses/{courseId}', 'Courses', 'View a published course; draft requires owner token', null, null, false);
add('patch', '/courses/{courseId}', 'Courses', 'Update own course', v.updateCourse, null, true, 200, { title: 'Updated Node.js Course' });
add('delete', '/courses/{courseId}', 'Courses', 'Delete own course and related records', null, null, true, 204);
add('get', '/instructor/courses', 'Instructor Stats', 'List instructor courses, including drafts', null, v.paging);
add('get', '/instructor/stats', 'Instructor Stats', 'Enrollment counts and weighted rating analytics');
add('get', '/courses/{courseId}/lessons', 'Lessons', 'List lessons; protected content requires enrollment', null, null, false);
add('post', '/courses/{courseId}/lessons', 'Lessons', 'Create lesson in own course', v.createLesson, null, true, 201, lessonExample);
add('get', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Read lesson; previews are public', null, null, false);
add('patch', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Update lesson in own course', v.updateLesson, null, true, 200, { title: 'Updated Introduction' });
add('delete', '/courses/{courseId}/lessons/{lessonId}', 'Lessons', 'Delete lesson in own course', null, null, true, 204);
add('post', '/courses/{courseId}/enroll', 'Enrollments', 'Enroll as student', null, null, true, 201);
add('delete', '/courses/{courseId}/enroll', 'Enrollments', 'Unenroll and remove progress and rating', null, null, true, 204);
add('get', '/enrollments/me', 'Enrollments', 'List enrolled courses', null, v.paging);
add('get', '/courses/{courseId}/enrollment-status', 'Enrollments', 'Check own enrollment');
add('get', '/courses/{courseId}/progress', 'Progress', 'Get completion count and percentage');
add('patch', '/lessons/{lessonId}/progress', 'Progress', 'Mark lesson completed or incomplete', v.progress, null, true, 200, { completed: true });
add('get', '/lessons/{lessonId}/comments', 'Comments', 'List comments (enrolled student or owner)', null, v.paging);
add('post', '/lessons/{lessonId}/comments', 'Comments', 'Comment as enrolled student', v.comment, null, true, 201, { text: 'Helpful lesson!' });
add('patch', '/comments/{commentId}', 'Comments', 'Edit own comment', v.comment, null, true, 200, { text: 'Updated feedback' });
add('delete', '/comments/{commentId}', 'Comments', 'Delete own comment', null, null, true, 204);
add('get', '/courses/{courseId}/ratings', 'Ratings', 'List ratings', null, v.paging, false);
add('post', '/courses/{courseId}/ratings', 'Ratings', 'Rate as enrolled student', v.rating, null, true, 201, { value: 5, review: 'Great course' });
add('patch', '/courses/{courseId}/ratings/me', 'Ratings', 'Update own rating', v.rating, null, true, 200, { value: 4, review: 'Updated review' });
add('delete', '/courses/{courseId}/ratings/me', 'Ratings', 'Delete own rating', null, null, true, 204);
module.exports = {
  openapi: '3.0.3', info: { title: 'Online Course Platform API', version: '1.0.0', description: 'JWT roles: student and instructor. Drafts are visible only to their owner. No payment processing is implemented; enrollment is immediate even for courses with a listed price.' },
  servers: [{ url: '/api/v1' }], paths,
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } }, schemas: {
    Success: { type: 'object', properties: { success: { type: 'boolean', example: true }, message: { type: 'string' }, data: {},
      results: { type: 'integer' }, pagination: { type: 'object', properties: { page: { type: 'integer' }, limit: { type: 'integer' }, totalPages: { type: 'integer' }, totalItems: { type: 'integer' } } } } },
    Error: { type: 'object', properties: { success: { type: 'boolean', example: false }, message: { type: 'string' }, errors: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, message: { type: 'string' } } } } } }
  } }
};
Object.defineProperty(module.exports, 'operations', { value: operations, enumerable: false });
