// routes/auth.js — OTP Email + Register + Login + Reset Password
const express  = require('express');
const router   = express.Router();
const nodemailer = require('nodemailer');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

// ── In-memory OTP store (use Redis in production) ─────────────────────
// { email: { otp, expiresAt } }
const otpStore = {};

// ── Demo users (in production, use MongoDB Member model) ──────────────
const DEMO_USERS = [
  { email: 'john.doe@email.com',       password: 'password123', name: 'John Doe',        role: 'member' },
  { email: 'librarian@alexandria.lib', password: 'lib123',      name: 'Librarian Staff', role: 'librarian' },
  { email: 'admin@alexandria.lib',     password: 'admin123',    name: 'Admin User',      role: 'admin' },
];

// ── Nodemailer transporter ─────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

// ── Generate 6-digit OTP ───────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ════════════════════════════════════════════════════════════════════════
// POST /api/auth/send-otp
// Body: { email }
// ════════════════════════════════════════════════════════════════════════
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const lowerEmail = email.toLowerCase();

  // Check if email is registered in DEMO_USERS or MongoDB Member
  const isDemo = DEMO_USERS.some(u => u.email.toLowerCase() === lowerEmail);
  const Member = (() => { try { return require('../models/Member'); } catch(e) { return null; } })();
  let isDbMember = false;
  if (Member) {
    try {
      const existing = await Member.findOne({ email: lowerEmail });
      if (existing) isDbMember = true;
    } catch(e) {
      console.error('Member lookup error:', e.message);
    }
  }

  if (!isDemo && !isDbMember) {
    return res.status(404).json({ message: 'This email is not registered with us' });
  }

  const otp       = generateOTP();
  const expiresAt = Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 10) * 60 * 1000;
  otpStore[lowerEmail] = { otp, expiresAt };

  // ── Send OTP Email ──────────────────────────────────────────────────
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Alexandria Digital Library 📚" <${process.env.GMAIL_USER}>`,
      to:   email,
      subject: 'Your Alexandria Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#0f172a;font-family:Arial,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0d9488,#0891b2);padding:32px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">📚</div>
              <div style="color:white;font-size:20px;font-weight:700;">Alexandria Digital Library</div>
              <div style="color:rgba(255,255,255,0.8);font-size:13px;margin-top:4px;">Public Community Library</div>
            </div>
            <!-- Body -->
            <div style="padding:32px;">
              <p style="color:#94a3b8;font-size:14px;margin-top:0;">Hi there,</p>
              <p style="color:#e2e8f0;font-size:14px;">We received a request to reset your Alexandria Library account password. Use the OTP below:</p>
              <!-- OTP Box -->
              <div style="background:#0f172a;border:2px dashed #0d9488;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <div style="color:#94a3b8;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">Your One-Time Password</div>
                <div style="color:#0d9488;font-size:40px;font-weight:700;letter-spacing:12px;">${otp}</div>
                <div style="color:#64748b;font-size:12px;margin-top:8px;">Valid for ${process.env.OTP_EXPIRY_MINUTES || 10} minutes</div>
              </div>
              <p style="color:#94a3b8;font-size:13px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            </div>
            <!-- Footer -->
            <div style="background:#0f172a;padding:16px;text-align:center;border-top:1px solid #334155;">
              <p style="color:#475569;font-size:11px;margin:0;">© ${new Date().getFullYear()} Alexandria Public Library. Free for everyone. 🏛</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ message: `OTP sent successfully to ${email}` });

  } catch (err) {
    console.error('❌ Email send failed:', err.message);
    // Still return OTP in console for development if email fails
    res.status(500).json({ message: 'Failed to send email. Check GMAIL_USER and GMAIL_PASS in .env', error: err.message });
  }
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/auth/verify-otp
// Body: { email, otp }
// ════════════════════════════════════════════════════════════════════════
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

  const record = otpStore[email.toLowerCase()];
  if (!record)                    return res.status(400).json({ message: 'No OTP found. Please request again.' });
  if (Date.now() > record.expiresAt) {
    delete otpStore[email.toLowerCase()];
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }
  if (record.otp !== otp.trim()) return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

  // OTP verified — issue a short-lived reset token
  const resetToken = jwt.sign(
    { email: email.toLowerCase(), purpose: 'password_reset' },
    process.env.JWT_SECRET || 'alexandria_secret',
    { expiresIn: '15m' }
  );
  delete otpStore[email.toLowerCase()];
  res.json({ message: 'OTP verified', resetToken });
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/auth/reset-password
// Body: { resetToken, newPassword }
// ════════════════════════════════════════════════════════════════════════
router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ message: 'Token and new password required' });

  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'alexandria_secret');
  } catch(e) {
    return res.status(401).json({ message: 'Reset token is invalid or expired. Please start over.' });
  }

  if (decoded.purpose !== 'password_reset') return res.status(401).json({ message: 'Invalid token purpose' });

  // Update in DB if Member model exists
  const Member = (() => { try { return require('../models/Member'); } catch(e) { return null; } })();
  if (Member) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await Member.updateOne({ email: decoded.email }, { $set: { password: hashed } });
  }

  console.log(`✅ Password reset for: ${decoded.email}`);
  res.json({ message: 'Password reset successful' });
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// Body: { name, email, phone, password, role, passcode }
// ════════════════════════════════════════════════════════════════════════
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role = 'member', passcode } = req.body;
  if (!name || !email || !phone || !password)
    return res.status(400).json({ message: 'All fields are required' });

  // Validate passcode for staff/admin roles
  if (role === 'librarian' && passcode !== 'LIB2026') {
    return res.status(403).json({ message: 'Invalid Librarian Security Passcode. Use: LIB2026' });
  }
  if (role === 'admin' && passcode !== 'ADMIN2026') {
    return res.status(403).json({ message: 'Invalid Admin Security Passcode. Use: ADMIN2026' });
  }

  // Split full name into firstName / lastName
  const parts     = name.trim().split(' ');
  const firstName = parts[0];
  const lastName  = parts.slice(1).join(' ') || '';

  const Member = (() => { try { return require('../models/Member'); } catch(e) { return null; } })();

  // Check duplicate in demo users
  if (DEMO_USERS.some(u => u.email.toLowerCase() === email.toLowerCase()))
    return res.status(409).json({ message: 'Email already registered' });

  if (Member) {
    try {
      const existing = await Member.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(409).json({ message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const member = new Member({ firstName, lastName, email: email.toLowerCase(), phone, password: hashed, role });
      await member.save();
      return res.json({ message: 'Account created successfully', memberId: member._id.toString().slice(-6).toUpperCase(), role });
    } catch(err) {
      console.error('Register error:', err.message);
      return res.status(500).json({ message: 'Registration failed: ' + err.message });
    }
  }

  res.json({ message: 'Account created successfully (demo mode)', memberId: 'M' + Date.now().toString().slice(-6), role });
});

// ════════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// Body: { email, password, role }
// ════════════════════════════════════════════════════════════════════════
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const lowerEmail = email.toLowerCase();

  // 1) Check demo users
  const demo = DEMO_USERS.find(u => u.email.toLowerCase() === lowerEmail);
  if (demo) {
    if (demo.password !== password)
      return res.status(401).json({ message: 'Incorrect password' });

    const token = jwt.sign({ email: demo.email, name: demo.name, role: demo.role },
      process.env.JWT_SECRET || 'alexandria_secret', { expiresIn: '7d' });
    return res.json({ message: 'Login successful', token, name: demo.name, role: demo.role, email: demo.email });
  }

  // 2) Check DB members
  const Member = (() => { try { return require('../models/Member'); } catch(e) { return null; } })();
  if (Member) {
    const member = await Member.findOne({ email: lowerEmail });
    if (!member) return res.status(404).json({ message: 'No account found with this email' });

    const match = await bcrypt.compare(password, member.password);
    if (!match) return res.status(401).json({ message: 'Incorrect password' });

    const fullName = member.fullName || `${member.firstName} ${member.lastName}`.trim();
    const userRole = member.role || 'member';
    const token = jwt.sign({ email: member.email, name: fullName, role: userRole },
      process.env.JWT_SECRET || 'alexandria_secret', { expiresIn: '7d' });
    return res.json({ message: 'Login successful', token, name: fullName, role: userRole, email: member.email });
  }

  res.status(404).json({ message: 'No account found with this email' });
});

module.exports = router;
