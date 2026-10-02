const ApiError = require('../utils/ApiError');
exports.validate = (schema, source = 'body') => (req, res, next) => {
  const { value, error } = schema.validate(req[source], { abortEarly: false, convert: true });
  if (error) throw new ApiError(422, 'Validation failed', error.details.map(d => ({ field: d.path.join('.'), message: d.message })));
  req.validated = { ...req.validated, [source]: value };
  next();
};
exports.safeInput = (req, res, next) => {
  const inspect = (value) => {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith('$') || key.includes('.') || ['__proto__', 'constructor', 'prototype'].includes(key))
        throw new ApiError(400, 'Unsafe request key');
      inspect(child);
    }
  };
  inspect(req.body); inspect(req.query);
  next();
};
