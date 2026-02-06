const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    division: {
      type: String,
      enum: ['Office', 'Personal'],
      required: function () {
        return this.type === 'expense';
      },
    },
    description: {
      type: String,
      maxlength: 100,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    relatedAccount: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;


