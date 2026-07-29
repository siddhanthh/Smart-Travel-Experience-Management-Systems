const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTripSchema } = require('../validators/tripValidator');

router.use(authenticate);

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, destination, start_date, end_date]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               destination:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               max_members:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Trip created
 *   get:
 *     summary: List all trips
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 */
router.post('/', validate(createTripSchema), tripController.createTrip);
router.get('/', tripController.getTrips);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     summary: Get trip details
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip details
 */
router.get('/:id', tripController.getTripById);
router.get('/:id/members', tripController.getTripMembers);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

/**
 * @openapi
 * /trips/{id}/join:
 *   post:
 *     summary: Join a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully joined trip
 */
router.post('/:id/join', tripController.joinTrip);

/**
 * @openapi
 * /trips/{id}/cancel:
 *   put:
 *     summary: Cancel a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip cancelled
 */
router.put('/:id/cancel', tripController.cancelTrip);

module.exports = router;