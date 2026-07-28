const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    tripId: { type: Number, required: true },
    userId: { type: Number, required: true },
    content: { type: String, required: true },
    images: [{ type: String }]
  },
  { timestamps: true }
);

// Indexing for rapid retrieval of latest posts per trip
postSchema.index({ tripId: 1, createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);