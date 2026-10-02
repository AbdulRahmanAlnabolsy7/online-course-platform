const fs = require('fs');
const path = require('path');
const docs = require('../src/docs/swagger');
const groups = new Map();
for (const op of docs.operations) {
  const raw = '{{baseUrl}}' + op.path.replace(/\{(\w+)\}/g, '{{$1}}');
  const request = { method: op.method.toUpperCase(), header: [], url: raw,
    description: op.summary, auth: op.security ? { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}', type: 'string' }] } : { type: 'noauth' } };
  if (op.example) {
    request.header.push({ key: 'Content-Type', value: 'application/json' });
    request.body = { mode: 'raw', raw: JSON.stringify(op.example, null, 2), options: { raw: { language: 'json' } } };
  }
  const lines = [`pm.test('Expected status', function () { pm.response.to.have.status(${op.status}); });`];
  if (op.path.startsWith('/auth/') && op.method === 'post') lines.push("if (pm.response.code < 300) pm.collectionVariables.set('token', pm.response.json().data.token);");
  const variable = op.method === 'post' ? ({ '/courses': 'courseId', '/courses/{courseId}/lessons': 'lessonId', '/lessons/{lessonId}/comments': 'commentId' })[op.path] : null;
  if (variable) lines.push(`if (pm.response.code < 300) pm.collectionVariables.set('${variable}', pm.response.json().data._id);`);
  const item = { name: op.summary, request, event: [{ listen: 'test', script: { type: 'text/javascript', exec: lines } }] };
  if (!groups.has(op.tag)) groups.set(op.tag, []);
  groups.get(op.tag).push(item);
}
const collection = { info: { name: 'Online Course Platform', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  variable: ['baseUrl', 'token', 'courseId', 'lessonId', 'commentId'].map(key => ({ key, value: key === 'baseUrl' ? 'http://localhost:5000/api/v1' : '' })),
  item: Array.from(groups, ([name, item]) => ({ name, item })) };
fs.mkdirSync(path.join(__dirname, '../postman'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../postman/online-course-platform.json'), JSON.stringify(collection, null, 2) + '\n');
