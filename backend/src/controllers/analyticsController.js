const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// Helper to build match stage for user & optional date range
const buildMatchStage = (userId, startDate, endDate) => {
  // Ensure userId is ObjectId (Mongoose handles this automatically in most cases, but being explicit)
  const match = { userId: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId.toString()) : userId };

  if (startDate || endDate) {
    match.date = {};
    if (startDate) {
      // Ensure date is at start of day
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      match.date.$gte = start;
    }
    if (endDate) {
      // Ensure date is at end of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }

  return match;
};

// @desc    Get analytics grouped by month, week, and year
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = buildMatchStage(req.user._id, startDate, endDate);

  const [monthly, weekly, yearly] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          type: '$_id.type',
          totalAmount: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            week: { $isoWeek: '$date' },
            type: '$type',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          week: '$_id.week',
          type: '$_id.type',
          totalAmount: 1,
        },
      },
      { $sort: { year: 1, week: 1 } },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            type: '$type',
          },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          type: '$_id.type',
          totalAmount: 1,
        },
      },
      { $sort: { year: 1 } },
    ]),
  ]);

  res.json({
    monthly,
    weekly,
    yearly,
  });
};

// @desc    Get category breakdown
// @route   GET /api/analytics/categories
// @access  Private
const getCategoryBreakdown = async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = buildMatchStage(req.user._id, startDate, endDate);

  const categoryData = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          category: '$category',
          type: '$type',
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: '$_id.category',
        type: '$_id.type',
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  res.json(categoryData);
};

// @desc    Get division breakdown
// @route   GET /api/analytics/divisions
// @access  Private
const getDivisionBreakdown = async (req, res) => {
  const { startDate, endDate } = req.query;
  const match = buildMatchStage(req.user._id, startDate, endDate);
  match.type = 'expense'; // Only expenses have divisions

  const divisionData = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$division',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        division: '$_id',
        totalAmount: 1,
        count: 1,
      },
    },
    { $sort: { totalAmount: -1 } },
  ]);

  res.json(divisionData);
};

module.exports = {
  getAnalyticsSummary,
  getCategoryBreakdown,
  getDivisionBreakdown,
};


