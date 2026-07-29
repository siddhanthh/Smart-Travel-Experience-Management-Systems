const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

/**
 * @openapi
 * /search/trips:
 *   get:
 *     summary: Search trips by title, destination, or description
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching trips list
 */
router.get('/trips', searchController.searchTrips);

/**
 * @openapi
 * /search/users:
 *   get:
 *     summary: Search users by name or email
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching users list
 */
router.get('/users', searchController.searchUsers);

module.exports = router;