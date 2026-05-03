const express = require('express');
const router = express.Router();
const { getTeamPerformance } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/team-performance', protect, getTeamPerformance);
router.get('/manager-stats', protect, getManagerAnalytics);
router.get('/member-productivity', protect, getMemberProductivity);

module.exports = router;