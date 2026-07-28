const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: Number, required: true },
    type: { type: String, default: 'like' }
  },
  { timestamps: true }
);

// Compound index enforcing 1 reaction per user per post
reactionSchema.index({ postId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);