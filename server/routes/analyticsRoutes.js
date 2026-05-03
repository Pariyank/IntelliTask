const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { 
  getManagerAnalytics, 
  getMemberProductivity, 
  getTeamPerformance 
} = require('../controllers/analyticsController');

router.get('/manager-stats', protect, getManagerAnalytics);

router.get('/member-productivity', protect, getMemberProductivity);

router.get('/team-performance', protect, getTeamPerformance);

module.exports = router;