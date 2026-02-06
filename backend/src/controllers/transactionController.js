const Transaction = require('../models/Transaction');

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
const createTransaction = async (req, res) => {
  const {
    type,
    amount,
    category,
    division,
    description,
    date,
    relatedAccount,
  } = req.body;

  if (!type || amount == null || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const transaction = await Transaction.create({
    userId: req.user._id,
    type,
    amount,
    category,
    division,
    description,
    date,
    relatedAccount,
  });

  res.status(201).json(transaction);
};

// @desc    Get transactions with filters
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  const { startDate, endDate, category, division } = req.query;

  const filter = { userId: req.user._id };

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  if (category) {
    filter.category = category;
  }

  if (division) {
    filter.division = division;
  }

  const transactions = await Transaction.find(filter).sort({ date: -1 });

  res.json(transactions);
};

// @desc    Update transaction (with 12-hour rule)
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  const now = Date.now();
  const createdAt = new Date(transaction.createdAt).getTime();

  if (now - createdAt > TWELVE_HOURS_MS) {
    return res
      .status(403)
      .json({ message: 'Transaction can only be edited within 12 hours of creation' });
  }

  const {
    type,
    amount,
    category,
    division,
    description,
    date,
    relatedAccount,
  } = req.body;

  transaction.type = type ?? transaction.type;
  transaction.amount = amount ?? transaction.amount;
  transaction.category = category ?? transaction.category;
  transaction.division = division ?? transaction.division;
  transaction.description = description ?? transaction.description;
  transaction.date = date ?? transaction.date;
  transaction.relatedAccount = relatedAccount ?? transaction.relatedAccount;

  const updated = await transaction.save();

  res.json(updated);
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({ message: 'Transaction not found' });
  }

  res.json({ message: 'Transaction removed' });
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};


