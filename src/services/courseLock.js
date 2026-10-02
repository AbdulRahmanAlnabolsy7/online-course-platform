// Serializes rating writes in one API process. Multiple instances need database transactions.
const tails = new Map();
module.exports = handler => async (req, res, next) => {
  const key = req.params.courseId;
  const previous = tails.get(key) || Promise.resolve();
  let release;
  const current = new Promise(resolve => { release = resolve; });
  tails.set(key, current);
  await previous;
  try { await handler(req, res, next); }
  finally {
    release();
    if (tails.get(key) === current) tails.delete(key);
  }
};
