const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  book:       { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  member:     { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  type:       { type: String, required: true, enum: ['issue', 'return'] },
  issueDate:  { type: Date, default: Date.now },
  dueDate:    { type: Date },
  returnDate: { type: Date },
  fine:       { type: Number, default: 0 },
  condition:  { type: String, enum: ['Good', 'Fair', 'Damaged'], default: 'Good' },
  notes:      { type: String, trim: true },
  status:     { type: String, default: 'active', enum: ['active', 'returned', 'overdue'] }
}, {
  timestamps: true
});

// Auto-set dueDate to 21 days from issueDate if not provided
transactionSchema.pre('save', function(next) {
  if (this.type === 'issue' && !this.dueDate) {
    this.dueDate = new Date(this.issueDate.getTime() + 21 * 24 * 60 * 60 * 1000);
  }
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);
