const Comment = require('../models/Comment');
const access = require('../services/access');
const ApiError = require('../utils/ApiError');
const { ok, paginate } = require('../utils/response');
exports.list = async (req, res) => {
  const { course } = await access.lesson(req.params.lessonId, req.user);
  await access.learning(course, req.user);
  await paginate(res, Comment, { lesson: req.params.lessonId }, req.validated.query, { populate: { path: 'user', select: 'name avatar' } });
};
exports.create = async (req, res) => {
  const { lesson, course } = await access.lesson(req.params.lessonId, req.user);
  await access.enrolled(course._id, req.user);
  const comment = await Comment.create({ user: req.user._id, lesson: lesson._id, ...req.validated.body });
  await comment.populate('user', 'name avatar');
  ok(res, comment, 'Comment created', 201);
};
const ownedComment = async (req) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) throw new ApiError(404, 'Comment not found');
  if (!comment.user.equals(req.user._id)) throw new ApiError(403, 'Only the comment owner can perform this action');
  return comment;
};
exports.update = async (req, res) => {
  const comment = await ownedComment(req);
  comment.text = req.validated.body.text;
  await comment.save();
  await comment.populate('user', 'name avatar');
  ok(res, comment, 'Comment updated');
};
exports.remove = async (req, res) => { await (await ownedComment(req)).deleteOne(); res.status(204).end(); };
