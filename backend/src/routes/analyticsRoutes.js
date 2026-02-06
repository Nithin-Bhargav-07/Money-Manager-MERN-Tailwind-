const express = require('express');
const {
  getAnalyticsSummary,
  getCategoryBreakdown,
  getDivisionBreakdown,
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, getAnalyticsSummary);
router.get('/categories', protect, getCategoryBreakdown);
router.get('/divisions', protect, getDivisionBreakdown);

module.exports = router;


