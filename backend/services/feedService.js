const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const pool = require('../config/db.mysql');
const { AppError } = require('../middleware/errorHandler');
const notificationService = require('./notificationService');

exports.createPost = async ({ tripId, userId, content, files }) => {
  const imageUrls = files ? files.map((file) => `/uploads/${file.filename}`) : [];

  const post = await Post.create({
    tripId: Number(tripId),
    userId,
    content,
    images: imageUrls
  });

  return post;
};

exports.deletePost = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);
  
  // Optional: delete associated comments and reactions (skip for brevity or implement if needed)
  await Comment.deleteMany({ postId: post._id });
  await Reaction.deleteMany({ postId: post._id });
  
  await Post.findByIdAndDelete(postId);
  return { message: 'Post deleted successfully' };
};

// MongoDB Aggregation Pipeline to join comments and reactions
exports.getTripFeed = async (tripId, { page = 1, limit = 10, currentUserId }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const posts = await Post.aggregate([
    { $match: { tripId: Number(tripId) } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
    // Join comments
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments'
      }
    },
    // Join reactions
    {
      $lookup: {
        from: 'reactions',
        localField: '_id',
        foreignField: 'postId',
        as: 'reactions'
      }
    },
    // Add computed fields
    {
      $addFields: {
        commentCount: { $size: '$comments' },
        reactionCount: { $size: '$reactions' },
        reactedByMe: {
          $cond: {
            if: { $in: [Number(currentUserId), '$reactions.userId'] },
            then: true,
            else: false
          }
        }
      }
    },
    { $project: { reactions: 0 } }
  ]);

  // Extract all user IDs (post authors + comment authors)
  const allUserIds = new Set();
  posts.forEach((p) => {
    if (p.userId) allUserIds.add(p.userId);
    if (Array.isArray(p.comments)) {
      p.comments.forEach((c) => {
        if (c.userId) allUserIds.add(c.userId);
      });
    }
  });

  const userIdsArray = [...allUserIds];
  let userMap = {};

  if (userIdsArray.length > 0) {
    const [users] = await pool.query(
      `SELECT id, name FROM users WHERE id IN (${userIdsArray.map(() => '?').join(',')})`,
      userIdsArray
    );
    users.forEach((u) => {
      userMap[u.id] = u.name;
    });
  }

  const enrichedPosts = posts.map((post) => ({
    ...post,
    authorName: userMap[post.userId] || 'Unknown User',
    comments: (post.comments || []).map((c) => ({
      ...c,
      authorName: userMap[c.userId] || `User #${c.userId}`
    }))
  }));

  return enrichedPosts;
};

exports.getAllFeed = async ({ page = 1, limit = 20, currentUserId }) => {
  const skip = (Number(page) - 1) * Number(limit);

  const posts = await Post.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments'
      }
    },
    {
      $lookup: {
        from: 'reactions',
        localField: '_id',
        foreignField: 'postId',
        as: 'reactions'
      }
    },
    {
      $addFields: {
        commentCount: { $size: '$comments' },
        reactionCount: { $size: '$reactions' },
        reactedByMe: {
          $cond: {
            if: { $in: [Number(currentUserId), '$reactions.userId'] },
            then: true,
            else: false
          }
        }
      }
    },
    { $project: { reactions: 0 } }
  ]);

  const allUserIds = new Set();
  posts.forEach((p) => {
    if (p.userId) allUserIds.add(p.userId);
    if (Array.isArray(p.comments)) {
      p.comments.forEach((c) => {
        if (c.userId) allUserIds.add(c.userId);
      });
    }
  });

  const tripIds = [...new Set(posts.map((p) => p.tripId))];
  const userIdsArray = [...allUserIds];
  let userMap = {};
  let tripMap = {};

  if (userIdsArray.length > 0) {
    const [users] = await pool.query(
      `SELECT id, name FROM users WHERE id IN (${userIdsArray.map(() => '?').join(',')})`,
      userIdsArray
    );
    users.forEach((u) => {
      userMap[u.id] = u.name;
    });
  }

  if (tripIds.length > 0) {
    const [trips] = await pool.query(
      `SELECT id, title FROM trips WHERE id IN (${tripIds.map(() => '?').join(',')})`,
      tripIds
    );
    trips.forEach((t) => {
      tripMap[t.id] = t.title;
    });
  }

  return posts.map((post) => ({
    ...post,
    authorName: userMap[post.userId] || 'Unknown User',
    tripTitle: tripMap[post.tripId] || `Trip #${post.tripId}`,
    comments: (post.comments || []).map((c) => ({
      ...c,
      authorName: userMap[c.userId] || `User #${c.userId}`
    }))
  }));
};

exports.addComment = async (postId, userId, content) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  const comment = await Comment.create({
    postId: new mongoose.Types.ObjectId(postId),
    userId,
    content
  });

  let commenterName = 'Someone';
  try {
    const [uRows] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
    if (uRows.length > 0) commenterName = uRows[0].name;
  } catch {}

  if (post.userId && Number(post.userId) !== Number(userId)) {
    notificationService.createNotification({
      userId: post.userId,
      type: 'post_comment',
      title: 'New Comment on Your Post',
      message: `${commenterName} commented: "${content.length > 35 ? content.slice(0, 35) + '...' : content}"`,
      referenceId: post._id,
      referenceType: 'post',
      idempotencyKey: `post_comment:${userId}:${comment._id}`
    }).catch(() => {});
  }

  return {
    ...comment.toObject(),
    authorName: commenterName
  };
};

exports.toggleReaction = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) throw new AppError('Post not found', 404);

  const existing = await Reaction.findOne({
    postId: new mongoose.Types.ObjectId(postId),
    userId
  });

  if (existing) {
    await Reaction.findByIdAndDelete(existing._id);
    // Delete corresponding like notification
    await Notification.deleteOne({
      userId: post.userId,
      type: 'post_like',
      referenceId: String(post._id)
    });
    return { message: 'Reaction removed', reacted: false };
  } else {
    await Reaction.create({
      postId: new mongoose.Types.ObjectId(postId),
      userId
    });

    if (post.userId && Number(post.userId) !== Number(userId)) {
      let reactorName = 'Someone';
      try {
        const [uRows] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
        if (uRows.length > 0) reactorName = uRows[0].name;
      } catch {}

      notificationService.createNotification({
        userId: post.userId,
        type: 'post_like',
        title: 'New Like on Your Post',
        message: `${reactorName} liked your post.`,
        referenceId: post._id,
        referenceType: 'post'
      }).catch(() => {});
    }

    return { message: 'Reaction added', reacted: true };
  }
};