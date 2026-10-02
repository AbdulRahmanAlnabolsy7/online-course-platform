exports.ok = (res, data, message = 'Request successful', status = 200) =>
  res.status(status).json({ success: true, message, data });

exports.paginate = async (res, Model, filter, query, options = {}) => {
  const { page = 1, limit = 10 } = query;
  let cursor = Model.find(filter).sort(options.sort || { createdAt: -1, _id: -1 })
    .skip((page - 1) * limit).limit(limit);
  if (options.populate) cursor = cursor.populate(options.populate);
  if (options.select) cursor = cursor.select(options.select);
  const [data, totalItems] = await Promise.all([cursor, Model.countDocuments(filter)]);
  return res.json({ success: true, results: data.length,
    pagination: { page, limit, totalPages: Math.ceil(totalItems / limit), totalItems }, data });
};
