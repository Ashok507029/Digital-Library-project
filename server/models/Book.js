const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  author:   { type: String, required: true, trim: true },
  genre:    { type: String, required: true, enum: ['Class 10th NCERT', 'Class 12th Science', 'Class 12th Maths', 'Class 12th Arts', 'Commerce & Economics', 'Competitive Exams', 'Poetry & Literature', 'Fiction', 'Science', 'History', 'Technology', 'Philosophy', 'Biography', 'Mystery', 'Self-Help'] },
  status:   { type: String, default: 'Available', enum: ['Available', 'Borrowed', 'Reserved'] },
  cover:    { type: String, default: '#1a1a3a' },
  emoji:    { type: String, default: '📖' },
  rating:   { type: Number, default: 0, min: 0, max: 5 },
  year:     { type: Number },
  isbn:     { type: String, unique: true, sparse: true },
  copies:   { type: Number, default: 1, min: 0 },
  borrowed: { type: Number, default: 0, min: 0 },
  branch:   { type: String, default: 'Main Branch' },
  indian:   { type: Boolean, default: false },
  ebook:    { type: Boolean, default: false },
  coverUrl: { type: String }
}, {
  timestamps: true
});

// Text index for search functionality
bookSchema.index({ title: 'text', author: 'text', isbn: 'text' });

module.exports = mongoose.model('Book', bookSchema);
