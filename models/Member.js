const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName:      { type: String, required: true, trim: true },
  lastName:       { type: String, default: '', trim: true },
  email:          { type: String, required: true, unique: true, trim: true, lowercase: true },
  phone:          { type: String, trim: true },
  password:       { type: String, default: '' },
  membershipType: { type: String, default: 'Standard', enum: ['Standard', 'Premium', 'VIP'] },
  role:           { type: String, default: 'member', enum: ['member', 'librarian', 'admin'] },
  status:         { type: String, default: 'Active', enum: ['Active', 'Suspended'] },
  branch:         { type: String, default: 'Main Branch' },
  joinDate:       { type: Date, default: Date.now },
  booksIssued:    { type: Number, default: 0 },
  totalFines:     { type: Number, default: 0 },
  active:         { type: Boolean, default: true }
}, {
  timestamps: true
});

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
memberSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Member', memberSchema);
