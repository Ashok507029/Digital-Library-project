const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// GET /api/members — Get all members
router.get('/', async (req, res) => {
  try {
    const { search, branch, membership } = req.query;
    const filter = {};

    if (search) {
      const terms = search.trim().split(/\s+/);
      const regexParts = terms.map(t => new RegExp(t, 'i'));
      const combinedRegex = new RegExp(search.replace(/\s+/g, ''), 'i');

      filter.$or = [
        { firstName: { $in: regexParts } },
        { lastName: { $in: regexParts } },
        { email: new RegExp(search.trim(), 'i') },
        { phone: new RegExp(search.trim(), 'i') }
      ];

      // If single term or concatenated term like JohnDoe
      if (terms.length === 1) {
        filter.$or.push({ firstName: new RegExp(search.trim(), 'i') });
        filter.$or.push({ lastName: new RegExp(search.trim(), 'i') });
      }
    }

    if (branch) filter.branch = branch;
    if (membership) filter.membershipType = membership;

    const members = await Member.find(filter).sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/members/:id — Get single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/members — Add new member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Member with this email already exists' });
    }
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// PUT /api/members/:id — Update member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
});

// DELETE /api/members/:id — Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
