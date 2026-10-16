const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Member = require('../models/Member');

// GET /api/transactions — Get all transactions
router.get('/', async (req, res) => {
  try {
    const { type, status } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;

    const transactions = await Transaction.find(filter)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/transactions/issue — Issue a book
router.post('/issue', async (req, res) => {
  try {
    const { bookId, memberId } = req.body;

    // Check book exists and is available
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const availableCopies = book.copies - book.borrowed;
    if (availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available for this book' });
    }

    // Check member exists
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Create transaction
    const transaction = new Transaction({
      book: bookId,
      member: memberId,
      type: 'issue'
    });
    await transaction.save();

    // Update book: increment borrowed count, update status if all copies borrowed
    book.borrowed += 1;
    if (book.borrowed >= book.copies) {
      book.status = 'Borrowed';
    }
    await book.save();

    // Update member: increment booksIssued
    member.booksIssued += 1;
    await member.save();

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email');

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: 'Issue failed', error: error.message });
  }
});

// POST /api/transactions/return — Return a book
router.post('/return', async (req, res) => {
  try {
    const { transactionId, condition, notes } = req.body;

    // Find the active transaction
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Calculate fine (₹15 per day overdue)
    const now = new Date();
    let fine = 0;
    if (now > transaction.dueDate) {
      const overdueDays = Math.ceil((now - transaction.dueDate) / (1000 * 60 * 60 * 24));
      fine = overdueDays * 15;
    }

    // Update transaction
    transaction.returnDate = now;
    transaction.status = 'returned';
    transaction.fine = fine;
    transaction.condition = condition || 'Good';
    transaction.notes = notes || '';
    await transaction.save();

    // Update book: decrement borrowed count, update status
    const book = await Book.findById(transaction.book);
    if (book) {
      book.borrowed = Math.max(0, book.borrowed - 1);
      if (book.borrowed < book.copies) {
        book.status = 'Available';
      }
      await book.save();
    }

    // Update member: decrement booksIssued, add fine
    const member = await Member.findById(transaction.member);
    if (member) {
      member.booksIssued = Math.max(0, member.booksIssued - 1);
      member.totalFines += fine;
      await member.save();
    }

    const populated = await Transaction.findById(transaction._id)
      .populate('book', 'title author isbn')
      .populate('member', 'firstName lastName email');

    res.json({ transaction: populated, fine });
  } catch (error) {
    res.status(400).json({ message: 'Return failed', error: error.message });
  }
});

module.exports = router;
