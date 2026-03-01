const express = require('express');
const router = express.Router();
const { getAdminDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/stats', protect, admin, getAdminDashboardStats);

module.exports = router;
