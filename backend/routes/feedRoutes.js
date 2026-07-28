const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { createPostSchema, createCommentSchema } = require('../validators/feedValidator');

router.use(authenticate);

router.post('/posts', upload.array('images', 5), validate(createPostSchema), feedController.createPost);
router.get('/posts/trip/:tripId', isTripMember, feedController.getTripFeed);
router.post('/posts/:postId/comments', validate(createCommentSchema), feedController.addComment);
router.post('/posts/:postId/reactions', feedController.toggleReaction);

module.exports = router;