require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS fix

const mongoose = require('mongoose');
const Book = require('./models/Book');
const Member = require('./models/Member');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ashokmorda20_db_user:ashok507029@cluster0.68pew8i.mongodb.net/digital-library?retryWrites=true&w=majority&appName=Cluster0';

// ── Book Data (from existing data.js) ──────────────────────────────
const BOOKS = [
  // 📜 Poetry & Literature
  { title:'Rashmirathi (रश्मिरथी)', author:'Ramdhari Singh Dinkar', genre:'Poetry & Literature', status:'Available', cover:'#b45309', emoji:'📜', rating:5.0, year:1952, isbn:'9788170281234', copies:8, borrowed:1, branch:'Main Branch' },
  { title:'Gitanjali', author:'Rabindranath Tagore', genre:'Poetry & Literature', status:'Available', cover:'#7c3aed', emoji:'🌸', rating:4.9, year:1910, isbn:'9780333904312', copies:6, borrowed:0, branch:'East Wing' },
  { title:'Madhushala (मधुशाला)', author:'Harivansh Rai Bachchan', genre:'Poetry & Literature', status:'Available', cover:'#991b1b', emoji:'🍷', rating:4.9, year:1935, isbn:'9788126702315', copies:10, borrowed:2, branch:'Main Branch' },

  // 📚 Class 10th (NCERT)
  { title:'NCERT Science - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#0284c7', emoji:'🧪', rating:4.8, year:2023, isbn:'9788174506459', copies:15, borrowed:3, branch:'Main Branch' },
  { title:'NCERT Mathematics - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#0d9488', emoji:'📐', rating:4.7, year:2023, isbn:'9788174506343', copies:12, borrowed:4, branch:'North Branch' },
  { title:'NCERT Social Science - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#d97706', emoji:'🌍', rating:4.6, year:2023, isbn:'9788174506893', copies:10, borrowed:2, branch:'East Wing' },

  // 🧪 Class 12th Science
  { title:'Concepts of Physics (Vol 1 & 2)', author:'Dr. H.C. Verma', genre:'Class 12th Science', status:'Available', cover:'#1e3a5f', emoji:'⚛️', rating:5.0, year:2021, isbn:'9788177091877', copies:14, borrowed:5, branch:'Main Branch' },
  { title:'NCERT Chemistry Part 1 & 2 - Class 12', author:'NCERT Board', genre:'Class 12th Science', status:'Available', cover:'#059669', emoji:'⚗️', rating:4.8, year:2023, isbn:'9788174507111', copies:12, borrowed:3, branch:'North Branch' },
  { title:'Trueman Elementary Biology - Class 12', author:'K.N. Bhatia & M.P. Tyagi', genre:'Class 12th Science', status:'Available', cover:'#15803d', emoji:'🧬', rating:4.7, year:2022, isbn:'9788187223441', copies:8, borrowed:2, branch:'Main Branch' },

  // 📐 Class 12th Mathematics
  { title:'Mathematics for Class 12 (RD Sharma)', author:'Dr. R.D. Sharma', genre:'Class 12th Maths', status:'Available', cover:'#1d4ed8', emoji:'📐', rating:4.9, year:2023, isbn:'9789353162009', copies:15, borrowed:6, branch:'Main Branch' },
  { title:'NCERT Mathematics Class 12th (Part 1 & 2)', author:'NCERT Board', genre:'Class 12th Maths', status:'Available', cover:'#2563eb', emoji:'📊', rating:4.7, year:2023, isbn:'9788174506503', copies:10, borrowed:2, branch:'North Branch' },

  // 🎨 Class 12th Arts & Humanities
  { title:'Themes in Indian History (Class 12)', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#9a3412', emoji:'🏛️', rating:4.8, year:2023, isbn:'9788174507203', copies:10, borrowed:1, branch:'East Wing' },
  { title:'Indian Constitution at Work & Political Theory', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#4338ca', emoji:'📜', rating:4.7, year:2023, isbn:'9788174507319', copies:8, borrowed:2, branch:'Main Branch' },
  { title:'Fundamentals of Human Geography', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#0369a1', emoji:'🗺️', rating:4.6, year:2023, isbn:'9788174507425', copies:7, borrowed:1, branch:'North Branch' },

  // 💼 Commerce & Economics
  { title:'Double Entry Book Keeping (Class 12)', author:'T.S. Grewal', genre:'Commerce & Economics', status:'Available', cover:'#047857', emoji:'📈', rating:4.9, year:2023, isbn:'9789353164010', copies:12, borrowed:4, branch:'Main Branch' },
  { title:'Indian Economic Development & Macroeconomics', author:'NCERT Board', genre:'Commerce & Economics', status:'Available', cover:'#0f766e', emoji:'💰', rating:4.7, year:2023, isbn:'9788174507500', copies:9, borrowed:2, branch:'East Wing' },

  // 🎯 Competitive Exams
  { title:'Indian Polity for UPSC', author:'M. Laxmikanth', genre:'Competitive Exams', status:'Available', cover:'#1e1b4b', emoji:'🎯', rating:5.0, year:2023, isbn:'9789353160128', copies:20, borrowed:8, branch:'Main Branch' },
  { title:'Problems in General Physics', author:'I.E. Irodov', genre:'Competitive Exams', status:'Available', cover:'#312e81', emoji:'🔬', rating:4.9, year:2020, isbn:'9788123901633', copies:6, borrowed:3, branch:'North Branch' },
  { title:'Quantitative Aptitude for Competitive Exams', author:'Dr. R.S. Aggarwal', genre:'Competitive Exams', status:'Available', cover:'#1f2937', emoji:'🔢', rating:4.8, year:2022, isbn:'9789352530168', copies:15, borrowed:5, branch:'Main Branch' },

  // General & Heritage Literature
  { title:'Wings of Fire', author:'A.P.J. Abdul Kalam', genre:'Biography', status:'Available', cover:'#2a1a0a', emoji:'🔥', rating:4.9, year:1999, isbn:'9788173711466', copies:5, borrowed:2, branch:'Main Branch' },
  { title:'Shrimad Bhagavad Gita', author:'Maharishi Ved Vyasa', genre:'Philosophy', status:'Available', cover:'#d97706', emoji:'🕉️', rating:5.0, year:1999, isbn:'9788170540001', copies:10, borrowed:2, branch:'Main Branch' },
  { title:'Atomic Habits', author:'James Clear', genre:'Self-Help', status:'Available', cover:'#1a3a1a', emoji:'⚛', rating:4.8, year:2018, isbn:'9780735211292', copies:5, borrowed:3, branch:'Main Branch' },
  { title:'Clean Code', author:'Robert C. Martin', genre:'Technology', status:'Available', cover:'#1a1a3a', emoji:'💻', rating:4.6, year:2008, isbn:'9780132350884', copies:3, borrowed:1, branch:'Main Branch' }
];

// ── Sample Members ─────────────────────────────────────────────────
const MEMBERS = [
  { firstName: 'John',    lastName: 'Doe',      email: 'john.doe@email.com',      phone: '+91 98765 43210', membershipType: 'Premium', branch: 'Main Branch',   booksIssued: 3 },
  { firstName: 'Priya',   lastName: 'Sharma',   email: 'priya.sharma@email.com',  phone: '+91 87654 32109', membershipType: 'Standard', branch: 'North Branch', booksIssued: 1 },
  { firstName: 'Rahul',   lastName: 'Verma',    email: 'rahul.verma@email.com',   phone: '+91 76543 21098', membershipType: 'Premium', branch: 'East Wing',     booksIssued: 2 },
  { firstName: 'Ananya',  lastName: 'Patel',    email: 'ananya.patel@email.com',  phone: '+91 65432 10987', membershipType: 'Standard', branch: 'Main Branch',  booksIssued: 0 },
  { firstName: 'Vikram',  lastName: 'Singh',    email: 'vikram.singh@email.com',  phone: '+91 54321 09876', membershipType: 'Premium', branch: 'North Branch',  booksIssued: 4 },
];

// ── Seed Function ──────────────────────────────────────────────────
async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Book.deleteMany({});
    await Member.deleteMany({});
    console.log('   ✓ Cleared books and members collections\n');

    // Insert books
    console.log('📚 Inserting books...');
    const insertedBooks = await Book.insertMany(BOOKS);
    console.log(`   ✓ ${insertedBooks.length} books inserted\n`);

    // Insert members
    console.log('👥 Inserting members...');
    const insertedMembers = await Member.insertMany(MEMBERS);
    console.log(`   ✓ ${insertedMembers.length} members inserted\n`);

    // Print summary
    console.log('═══════════════════════════════════════════');
    console.log('  ✅ Database seeded successfully!');
    console.log(`  📚 Books:   ${insertedBooks.length}`);
    console.log(`  👥 Members: ${insertedMembers.length}`);
    console.log('═══════════════════════════════════════════\n');

    console.log('📖 Sample books:');
    insertedBooks.slice(0, 5).forEach(b => {
      console.log(`   • ${b.title} by ${b.author} (${b._id})`);
    });

    console.log('\n👤 Sample members:');
    insertedMembers.forEach(m => {
      console.log(`   • ${m.firstName} ${m.lastName} — ${m.email} (${m._id})`);
    });

  } catch (error) {
    console.error('❌ Seed Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed.');
    process.exit(0);
  }
}

seedDatabase();
