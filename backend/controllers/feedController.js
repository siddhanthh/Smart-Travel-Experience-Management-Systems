const feedService = require('../services/feedService');
const fs = require('fs');

exports.createPost = async (req, res, next) => {
  try {
    const post = await feedService.createPost({
      tripId: req.body.tripId,
      userId: req.user.id,
      content: req.body.content,
      files: req.files
    });
    res.status(201).json({ message: 'Post created successfully', data: post });
  } catch (err) {
    // TRICKY SCENARIO #8: Clean up uploaded files if DB creation fails
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => fs.unlink(file.path, () => {}));
    }
    next(err);
  }
};

exports.getTripFeed = async (req, res, next) => {
  try {
    const posts = await feedService.getTripFeed(req.params.tripId, req.query);
    res.status(200).json({ data: posts });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const comment = await feedService.addComment(req.params.postId, req.user.id, req.body.content);
    res.status(201).json({ message: 'Comment added', data: comment });
  } catch (err) {
    next(err);
  }
};

exports.toggleReaction = async (req, res, next) => {
  try {
    const result = await feedService.toggleReaction(req.params.postId, req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};