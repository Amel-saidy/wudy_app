const express = require('express');
const router = express.Router();
const { saveMeasurements, getMyMeasurements, getUserMeasurements } = require('../controllers/measurementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, saveMeasurements).get(protect, getMyMeasurements);
router.route('/user/:id').get(protect, admin, getUserMeasurements);

module.exports = router;
