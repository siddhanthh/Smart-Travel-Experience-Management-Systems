const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { createTripSchema } = require('../validators/tripValidator');

router.use(authenticate); // Require login for all trip endpoints

router.post('/', validate(createTripSchema), tripController.createTrip);
router.get('/', tripController.getTrips);
router.get('/:id', tripController.getTripById);
router.post('/:id/join', tripController.joinTrip);
router.put('/:id/cancel', tripController.cancelTrip);

module.exports = router;