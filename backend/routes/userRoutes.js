const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUserProfile, forgotPassword, resetPassword, googleLogin } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/google-login', googleLogin);
router.get('/profile', protect, getUserProfile);

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
