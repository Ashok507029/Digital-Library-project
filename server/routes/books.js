const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books — Get all books (with search & filter)
router.get('/', async (req, res) => {
  try {
    const { search, genre, status, branch, indian } = req.query;
    const filter = {};

    // Search by title, author, or ISBN
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { title: regex },
        { author: regex },
        { isbn: regex }
      ];
    }

    // Filter by genre
    if (genre) filter.genre = genre;

    // Filter by status
    if (status) filter.status = status;

    // Filter by branch
    if (branch) {
      filter.$or = filter.$or || [];
      filter.branch = { $in: [branch, 'All Branches'] };
    }

    // Filter Indian books
    if (indian === 'true') filter.indian = true;

    const books = await Book.find(filter).sort({ indian: -1, createdAt: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/books/:id — Get single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/books/bulk — Bulk insert books from CSV
router.post('/bulk', async (req, res) => {
  try {
    const booksData = req.body;
    if (!Array.isArray(booksData) || booksData.length === 0) {
      return res.status(400).json({ message: 'Array of book objects is required' });
    }
    const inserted = await Book.insertMany(booksData, { ordered: false });
    res.status(201).json({ message: `${inserted.length} books imported successfully`, count: inserted.length });
  } catch (error) {
    // Return partial success if some duplicates were skipped
    if (error.insertedDocs) {
      return res.status(207).json({
        message: `${error.insertedDocs.length} books imported, duplicates skipped`,
        count: error.insertedDocs.length
      });
    }
    res.status(400).json({ message: 'Bulk import failed', error: error.message });
  }
});

// POST /api/books — Add new book
router.post('/', async (req, res) => {
  try {
    const bookData = { ...req.body };

    // Fix: Remove empty ISBN or replace with auto-generated unique ISBN to prevent duplicate key 11000 error
    if (!bookData.isbn || bookData.isbn.trim() === '') {
      delete bookData.isbn;
    }

    // Auto-detect Hindi characters (Devanagari Unicode range \u0900-\u097F)
    const hasHindi = /[\u0900-\u097F]/.test((bookData.title || '') + (bookData.author || ''));
    if (hasHindi) {
      bookData.indian = true;
    }

    const book = new Book(bookData);
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book with this ISBN already exists' });
    }
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// PUT /api/books/:id — Update book
router.put('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

// DELETE /api/books/:id — Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
