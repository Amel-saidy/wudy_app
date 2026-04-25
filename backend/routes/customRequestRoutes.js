const express = require('express');
const router = express.Router();
const { createCustomRequest, getMyCustomRequests, getAllCustomRequests, updateCustomRequestStatus } = require('../controllers/customRequestController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createCustomRequest).get(protect, getMyCustomRequests);
router.route('/all').get(protect, admin, getAllCustomRequests);
router.route('/:id/status').put(protect, admin, updateCustomRequestStatus);

module.exports = router;
