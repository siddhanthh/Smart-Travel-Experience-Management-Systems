const express = require('express');
const router = express.Router();
const feedController = require('../controllers/feedController');
const { authenticate } = require('../middleware/auth');
const { isTripMember } = require('../middleware/membership');
const upload = require('../middleware/upload');
const validate = require('../middleware/validate');
const { createPostSchema, createCommentSchema } = require('../validators/feedValidator');

router.use(authenticate);

/**
 * @openapi
 * /feed/posts:
 *   post:
 *     summary: Create a post in trip feed
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [tripId, content]
 *             properties:
 *               tripId:
 *                 type: integer
 *               content:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post('/posts', upload.array('images', 5), validate(createPostSchema), feedController.createPost);

/**
 * @openapi
 * /feed/posts/trip/{tripId}:
 *   get:
 *     summary: Get social feed for a trip
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feed posts with aggregated comments and reaction counts
 */
router.get('/posts/trip/:tripId', isTripMember, feedController.getTripFeed);

/**
 * @openapi
 * /feed/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
router.post('/posts/:postId/comments', validate(createCommentSchema), feedController.addComment);

/**
 * @openapi
 * /feed/posts/{postId}/reactions:
 *   post:
 *     summary: Toggle reaction/like on a post
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reaction toggled
 */
router.post('/posts/:postId/reactions', feedController.toggleReaction);

module.exports = router;