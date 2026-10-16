// ── API Configuration ──────────────────────────────────────────────
const API_BASE = 'http://localhost:3000/api';

// ── Helper: Get Open Library cover URL ─────────────────────────────
function getOpenLibraryCover(isbn, size = 'M') {
  if (!isbn) return '';
  const cleanIsbn = String(isbn).replace(/-/g, '');
  return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-${size}.jpg?default=false`;
}

// ── Global Data Store & Fallback Books ─────────────────────────────
const FALLBACK_BOOKS = [
  // 📜 Poetry & Literature
  { id: 'b1', title:'Rashmirathi (रश्मिरथी)', author:'Ramdhari Singh Dinkar', genre:'Poetry & Literature', status:'Available', cover:'#b45309', emoji:'📜', rating:5.0, year:1952, isbn:'9788170281234', copies:8, borrowed:1, branch:'Main Branch', coverUrl:'covers/rashmirathi.jpg' },
  { id: 'b2', title:'Gitanjali', author:'Rabindranath Tagore', genre:'Poetry & Literature', status:'Available', cover:'#7c3aed', emoji:'🌸', rating:4.9, year:1910, isbn:'9780333904312', copies:6, borrowed:0, branch:'East Wing', coverUrl:'covers/gitanjali.jpg' },
  { id: 'b3', title:'Madhushala (मधुशाला)', author:'Harivansh Rai Bachchan', genre:'Poetry & Literature', status:'Available', cover:'#991b1b', emoji:'🍷', rating:4.9, year:1935, isbn:'9788126702315', copies:10, borrowed:2, branch:'Main Branch', coverUrl:'covers/madhushala.jpg' },

  // 📚 Class 10th (NCERT)
  { id: 'b4', title:'NCERT Science - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#0284c7', emoji:'🧪', rating:4.8, year:2023, isbn:'9788174506459', copies:15, borrowed:3, branch:'Main Branch', coverUrl:'covers/ncert_science10.jpg' },
  { id: 'b5', title:'NCERT Mathematics - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#0d9488', emoji:'📐', rating:4.7, year:2023, isbn:'9788174506343', copies:12, borrowed:4, branch:'North Branch', coverUrl:'covers/ncert_math10.jpg' },
  { id: 'b6', title:'NCERT Social Science - Class 10th', author:'NCERT Editorial Board', genre:'Class 10th NCERT', status:'Available', cover:'#d97706', emoji:'🌍', rating:4.6, year:2023, isbn:'9788174506893', copies:10, borrowed:2, branch:'East Wing', coverUrl:'covers/ncert_social10.jpg' },

  // 🧪 Class 12th Science
  { id: 'b7', title:'Concepts of Physics (Vol 1 & 2)', author:'Dr. H.C. Verma', genre:'Class 12th Science', status:'Available', cover:'#1e3a5f', emoji:'⚛️', rating:5.0, year:2021, isbn:'9788177091877', copies:14, borrowed:5, branch:'Main Branch', coverUrl:'covers/physics_hcverma.jpg' },
  { id: 'b8', title:'NCERT Chemistry Part 1 & 2 - Class 12', author:'NCERT Board', genre:'Class 12th Science', status:'Available', cover:'#059669', emoji:'⚗️', rating:4.8, year:2023, isbn:'9788174507111', copies:12, borrowed:3, branch:'North Branch', coverUrl:'covers/ncert_chemistry12.jpg' },
  { id: 'b9', title:'Trueman Elementary Biology - Class 12', author:'K.N. Bhatia & M.P. Tyagi', genre:'Class 12th Science', status:'Available', cover:'#15803d', emoji:'🧬', rating:4.7, year:2022, isbn:'9788187223441', copies:8, borrowed:2, branch:'Main Branch', coverUrl:'covers/biology_trueman.jpg' },

  // 📐 Class 12th Mathematics
  { id: 'b10', title:'Mathematics for Class 12 (RD Sharma)', author:'Dr. R.D. Sharma', genre:'Class 12th Maths', status:'Available', cover:'#1d4ed8', emoji:'📐', rating:4.9, year:2023, isbn:'9789353162009', copies:15, borrowed:6, branch:'Main Branch', coverUrl:'covers/rdsharma.jpg' },
  { id: 'b11', title:'NCERT Mathematics Class 12th (Part 1 & 2)', author:'NCERT Board', genre:'Class 12th Maths', status:'Available', cover:'#2563eb', emoji:'📊', rating:4.7, year:2023, isbn:'9788174506503', copies:10, borrowed:2, branch:'North Branch', coverUrl:'covers/ncert_math12.jpg' },

  // 🎨 Class 12th Arts & Humanities
  { id: 'b12', title:'Themes in Indian History (Class 12)', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#9a3412', emoji:'🏛️', rating:4.8, year:2023, isbn:'9788174507203', copies:10, borrowed:1, branch:'East Wing', coverUrl:'covers/indian_history12.jpg' },
  { id: 'b13', title:'Indian Constitution at Work & Political Theory', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#4338ca', emoji:'📜', rating:4.7, year:2023, isbn:'9788174507319', copies:8, borrowed:2, branch:'Main Branch', coverUrl:'covers/samvidhan.png' },
  { id: 'b14', title:'Fundamentals of Human Geography', author:'NCERT Board', genre:'Class 12th Arts', status:'Available', cover:'#0369a1', emoji:'🗺️', rating:4.6, year:2023, isbn:'9788174507425', copies:7, borrowed:1, branch:'North Branch', coverUrl:'covers/ncert_geography12.jpg' },

  // 💼 Commerce & Economics
  { id: 'b15', title:'Double Entry Book Keeping (Class 12)', author:'T.S. Grewal', genre:'Commerce & Economics', status:'Available', cover:'#047857', emoji:'📈', rating:4.9, year:2023, isbn:'9789353164010', copies:12, borrowed:4, branch:'Main Branch', coverUrl:'covers/tsgrewal_accounts.jpg' },
  { id: 'b16', title:'Indian Economic Development & Macroeconomics', author:'NCERT Board', genre:'Commerce & Economics', status:'Available', cover:'#0f766e', emoji:'💰', rating:4.7, year:2023, isbn:'9788174507500', copies:9, borrowed:2, branch:'East Wing', coverUrl:'covers/ncert_economics12.jpg' },

  // 🎯 Competitive Exams
  { id: 'b17', title:'Indian Polity for UPSC', author:'M. Laxmikanth', genre:'Competitive Exams', status:'Available', cover:'#1e1b4b', emoji:'🎯', rating:5.0, year:2023, isbn:'9789353160128', copies:20, borrowed:8, branch:'Main Branch', coverUrl:'covers/laxmikanth.jpg' },
  { id: 'b18', title:'Problems in General Physics', author:'I.E. Irodov', genre:'Competitive Exams', status:'Available', cover:'#312e81', emoji:'🔬', rating:4.9, year:2020, isbn:'9788123901633', copies:6, borrowed:3, branch:'North Branch', coverUrl:'covers/irodov.jpg' },
  { id: 'b19', title:'Quantitative Aptitude for Competitive Exams', author:'Dr. R.S. Aggarwal', genre:'Competitive Exams', status:'Available', cover:'#1f2937', emoji:'🔢', rating:4.8, year:2022, isbn:'9789352530168', copies:15, borrowed:5, branch:'Main Branch', coverUrl:'covers/rsaggarwal_aptitude.jpg' },

  // Heritage & General Literature
  { id: 'b20', title:'Wings of Fire', author:'A.P.J. Abdul Kalam', genre:'Biography', status:'Available', cover:'#2a1a0a', emoji:'🔥', rating:4.9, year:1999, isbn:'9788173711466', copies:5, borrowed:2, branch:'Main Branch', coverUrl:'covers/wingsoffire.jpg' },
  { id: 'b21', title:'Shrimad Bhagavad Gita', author:'Maharishi Ved Vyasa', genre:'Philosophy', status:'Available', cover:'#d97706', emoji:'🕉️', rating:5.0, year:1999, isbn:'9788170540001', copies:10, borrowed:2, branch:'Main Branch', coverUrl:'covers/gita.png' },
  { id: 'b22', title:'Atomic Habits', author:'James Clear', genre:'Self-Help', status:'Available', cover:'#1a3a1a', emoji:'⚛', rating:4.8, year:2018, isbn:'9780735211292', copies:5, borrowed:3, branch:'Main Branch', coverUrl:'covers/atomichabits.jpg' },
  { id: 'b23', title:'Clean Code', author:'Robert C. Martin', genre:'Technology', status:'Available', cover:'#1a1a3a', emoji:'💻', rating:4.6, year:2008, isbn:'9780132350884', copies:3, borrowed:1, branch:'Main Branch', coverUrl:'covers/cleancode.jpg' }
];

// ── Global Fallback Members Store ──────────────────────────────────
const FALLBACK_MEMBERS = [
  { id: 'm1', _id: 'm1', firstName: 'Dr. Ashok', lastName: 'Choudhary', email: 'ashok.admin@alexandria.edu', phone: '+91 98765 00001', role: 'admin', membershipType: 'Staff Admin', status: 'Active', branch: 'Main Branch', booksIssued: 0 },
  { id: 'm2', _id: 'm2', firstName: 'Lokesh', lastName: 'Singh', email: 'lokesh.lib@alexandria.edu', phone: '+91 98765 00002', role: 'librarian', membershipType: 'Librarian Staff', status: 'Active', branch: 'Main Branch', booksIssued: 1 },
  { id: 'm3', _id: 'm3', firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phone: '+91 98765 43210', role: 'member', membershipType: 'Premium', status: 'Active', branch: 'Main Branch', booksIssued: 3 },
  { id: 'm4', _id: 'm4', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@email.com', phone: '+91 87654 32109', role: 'member', membershipType: 'Standard', status: 'Active', branch: 'North Branch', booksIssued: 1 },
  { id: 'm5', _id: 'm5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@email.com', phone: '+91 99887 76655', role: 'member', membershipType: 'Premium', status: 'Active', branch: 'Main Branch', booksIssued: 4 },
  { id: 'm6', _id: 'm6', firstName: 'Rahul', lastName: 'Verma', email: 'rahul.verma@email.com', phone: '+91 88776 65544', role: 'member', membershipType: 'Student', status: 'Active', branch: 'East Wing', booksIssued: 2 },
  { id: 'm7', _id: 'm7', firstName: 'Ananya', lastName: 'Patel', email: 'ananya.patel@email.com', phone: '+91 77665 54433', role: 'member', membershipType: 'Standard', status: 'Suspended', branch: 'North Branch', booksIssued: 0 }
];

let BOOKS = [];
let RECS = [];
let MEMBERS = [];

function filterFallbackBooks(params = {}) {
  let list = [...FALLBACK_BOOKS];

  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || (b.isbn && b.isbn.includes(q)));
  }

  if (params.genre) {
    list = list.filter(b => b.genre.toLowerCase() === params.genre.toLowerCase());
  }

  if (params.status) {
    list = list.filter(b => b.status === params.status);
  }

  if (params.branch) {
    list = list.filter(b => b.branch === params.branch || b.branch === 'All Branches');
  }

  if (params.indian === 'true' || params.indian === true) {
    list = list.filter(b => b.indian === true);
  }

  return list;
}

function filterFallbackMembers(params = {}) {
  let list = [...FALLBACK_MEMBERS];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(m => 
      (m.firstName + ' ' + m.lastName).toLowerCase().includes(q) || 
      m.email.toLowerCase().includes(q) ||
      (m.role && m.role.toLowerCase().includes(q))
    );
  }
  return list.map(m => ({ ...m, id: m._id || m.id, _id: m._id || m.id }));
}

// ── Fetch Books from API with Client Fallback ──────────────────────
async function fetchBooks(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/books?${query}` : `${API_BASE}/books`;
    
    // Set 2s timeout for local API fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Failed to fetch books from server');
    const books = await res.json();
    if (!Array.isArray(books) || books.length === 0) {
      return filterFallbackBooks(params);
    }
    return books.map(b => {
      let coverUrl = b.coverUrl;
      if (coverUrl && coverUrl.includes('localhost:3000')) {
        coverUrl = coverUrl.replace(/http:\/\/localhost:3000\//g, 'server/public/');
      }
      return { ...b, id: b._id || b.id, coverUrl };
    });
  } catch (error) {
    console.warn('API fetch offline/failed, using local fallback dataset:', error);
    return filterFallbackBooks(params);
  }
}

// ── Fetch Members from API ─────────────────────────────────────────
async function fetchMembers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/members?${query}` : `${API_BASE}/members`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) throw new Error('Failed to fetch members');
    const members = await res.json();
    if (!Array.isArray(members) || members.length === 0) {
      return filterFallbackMembers(params);
    }
    return members.map(m => ({ ...m, id: m._id || m.id, _id: m._id || m.id }));
  } catch (error) {
    console.warn('API fetch members offline, using fallback dataset:', error);
    return filterFallbackMembers(params);
  }
}

// ── API Helper Functions ───────────────────────────────────────────
async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'API Error');
    return result;
  } catch (error) {
    console.warn(`API POST ${endpoint} failed, updating local state:`, error);
    if (endpoint.includes('/books')) {
      const newBook = { ...data, id: 'b-' + Date.now(), _id: 'b-' + Date.now() };
      FALLBACK_BOOKS.unshift(newBook);
      return newBook;
    }
    if (endpoint.includes('/members')) {
      const newMember = {
        id: 'm-' + Date.now(),
        _id: 'm-' + Date.now(),
        firstName: data.firstName || 'New',
        lastName: data.lastName || 'Member',
        email: data.email || 'member@alexandria.lib',
        phone: data.phone || '+91 99999 88888',
        role: data.role || 'member',
        membershipType: data.membershipType || 'Standard',
        status: 'Active',
        branch: data.branch || 'Main Branch',
        booksIssued: 0
      };
      FALLBACK_MEMBERS.unshift(newMember);
      return newMember;
    }
    return { success: true, ...data };
  }
}

async function apiPut(endpoint, data) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'API Error');
    return result;
  } catch (error) {
    console.warn(`API PUT ${endpoint} failed, updating local fallback:`, error);
    if (endpoint.includes('/members/')) {
      const targetId = endpoint.split('/members/')[1];
      const member = FALLBACK_MEMBERS.find(m => m.id === targetId || m._id === targetId);
      if (member) {
        if (data.role) member.role = data.role;
        if (data.status) member.status = data.status;
      }
    }
    return { success: true, ...data };
  }
}

async function apiDelete(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'API Error');
    return result;
  } catch (error) {
    console.warn(`API DELETE ${endpoint} failed:`, error);
    return { success: true };
  }
}

// ── Load Initial Data ──────────────────────────────────────────────
async function loadInitialData() {
  BOOKS = await fetchBooks();
  MEMBERS = await fetchMembers();
  RECS = BOOKS.filter(b => ['Shrimad Bhagavad Gita', 'Wings of Fire', 'Atomic Habits', 'Clean Code'].includes(b.title));
  return BOOKS;
}
