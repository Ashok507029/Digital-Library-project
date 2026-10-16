// ═════════════════════════════════════════════════════════════════════
// 📚 ALEXANDRIA DIGITAL LIBRARY — UNIFIED SINGLE PAGE APPLICATION (SPA)
// ═════════════════════════════════════════════════════════════════════

// ── Central Navigation & Page Management ────────────────────────────
function showPage(id) {
  const validPages = ['catalog', 'member', 'librarian', 'admin', 'login'];
  if (!validPages.includes(id)) id = 'catalog';

  // 1. Switch Active Container
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) {
    target.classList.add('active');
  }

  // 2. Update Nav Buttons
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.getAttribute('data-page') === id) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });

  // 3. Update URL Hash without page jump
  if (window.location.hash !== '#' + id) {
    history.replaceState(null, '', '#' + id);
  }

  // 4. Page-Specific Lazy Initializers
  if (id === 'member') {
    renderMemberDashboard();
  } else if (id === 'librarian') {
    renderLibrarianDashboard();
  } else if (id === 'admin') {
    renderAdminDashboard();
  } else if (id === 'catalog') {
    if (typeof BOOKS !== 'undefined' && BOOKS.length > 0 && typeof renderBooks === 'function') {
      renderBooks(BOOKS, 'book-grid');
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Tab Switchers within Pages ──────────────────────────────────────
function memberTab(el, id) {
  document.querySelectorAll('#page-member .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['mt-current', 'mt-history'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
}

function libTab(el, id) {
  document.querySelectorAll('#page-librarian .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['lt-issue', 'lt-members', 'lt-fines', 'lt-inventory', 'lt-import'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
  if (id === 'lt-inventory') {
    filterInventoryBranch('Main Branch');
  }
}

function adminTab(el, id) {
  document.querySelectorAll('#page-admin .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['at-roles', 'at-branches', 'at-payment'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
  if (id === 'at-payment') {
    const filterVal = document.getElementById('rev-filter') ? document.getElementById('rev-filter').value : 'all';
    filterRevenueLedger(filterVal);
  }
}

// ── Header & Session Controller ─────────────────────────────────────
function updateHeaderUI() {
  const role = localStorage.getItem('user_role') || 'guest';
  const name = localStorage.getItem('user_name') || 'Guest';

  // Role Badge
  const roleEl = document.getElementById('role-label') || document.getElementById('header-role');
  if (roleEl) {
    if (role === 'guest') {
      roleEl.textContent = 'Guest';
      roleEl.style.background = 'var(--navy)';
      roleEl.style.color = 'var(--text3)';
    } else {
      roleEl.textContent = role.toUpperCase();
      if (role === 'admin') {
        roleEl.style.background = 'var(--red)';
        roleEl.style.color = 'white';
      } else if (role === 'librarian') {
        roleEl.style.background = 'var(--amber)';
        roleEl.style.color = 'white';
      } else {
        roleEl.style.background = 'var(--teal)';
        roleEl.style.color = 'white';
      }
    }
  }

  // Avatar Initials
  const avatarEl = document.getElementById('user-avatar') || document.getElementById('header-avatar');
  if (avatarEl) {
    if (role === 'guest') {
      avatarEl.textContent = '?';
      avatarEl.title = 'Click to Sign In';
    } else {
      const parts = name.trim().split(' ').filter(Boolean);
      avatarEl.textContent = parts.map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
      avatarEl.title = `${name} (${role.toUpperCase()}) — Click to open Account`;
    }
  }

  // Login Button in Nav
  const loginNavBtn = document.querySelector('.nav-btn[data-page="login"]');
  if (loginNavBtn) {
    if (role === 'guest') {
      loginNavBtn.innerHTML = '🔐 Login';
      loginNavBtn.style.color = 'var(--teal)';
      loginNavBtn.onclick = () => showPage('login');
    } else {
      loginNavBtn.innerHTML = `🚪 Logout (${name.split(' ')[0]})`;
      loginNavBtn.style.color = 'var(--red)';
      loginNavBtn.onclick = () => logoutUser();
    }
  }
}

function handleAvatarClick() {
  const role = localStorage.getItem('user_role');
  if (!role || role === 'guest') {
    showPage('login');
  } else if (role === 'admin') {
    showPage('admin');
  } else if (role === 'librarian') {
    showPage('librarian');
  } else {
    showPage('member');
  }
}

function logoutUser() {
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_email');
  notify('👋 Successfully logged out of Alexandria', 'info');
  updateHeaderUI();
  showPage('catalog');
}

// ── Branch Selector Modal ───────────────────────────────────────────
function showBranchModal() {
  showModal('📍 Select Campus Library Branch', `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${['Main Branch', 'North Branch', 'East Wing'].map(b => `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:var(--navy);border-radius:8px;cursor:pointer;border:1px solid var(--border);transition:all 0.2s" onclick="switchBranch('${b}')">
          <div>
            <div style="font-size:14px;font-weight:600;color:var(--text)">${b}</div>
            <div style="font-size:11px;color:var(--text3)">Open · Books & Study Space Available</div>
          </div>
          <span style="color:var(--teal);font-size:16px">→</span>
        </div>
      `).join('')}
    </div>
  `);
}

function switchBranch(b) {
  const currentBranchEl = document.getElementById('current-branch');
  if (currentBranchEl) currentBranchEl.textContent = b;
  closeModal();
  notify(`Switched to ${b}`, 'info');
  if (typeof filterBooks === 'function') filterBooks();
}

// ═════════════════════════════════════════════════════════════════════
// 👤 MEMBER DASHBOARD LOGIC
// ═════════════════════════════════════════════════════════════════════
function renderMemberDashboard() {
  let name = localStorage.getItem('user_name') || '';
  let email = localStorage.getItem('user_email') || '';

  // Default to demo member if not logged in
  if (!name || !email) {
    name = 'John Doe';
    email = 'john.doe@email.com';
    localStorage.setItem('user_role', 'member');
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_email', email);
    updateHeaderUI();
  }

  const isDemo = email.toLowerCase() === 'john.doe@email.com';
  const parts = name.trim().split(' ').filter(Boolean);
  const initials = parts.map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'JD';

  const profAvatar = document.getElementById('profile-avatar');
  if (profAvatar) profAvatar.textContent = initials;

  const profName = document.getElementById('profile-name');
  if (profName) profName.textContent = name;

  const memberId = email ? 'M' + (email.charCodeAt(0) * 100 + email.length).toString().padStart(5, '0') : 'M10618';
  const profSub = document.getElementById('profile-sub');
  if (profSub) profSub.textContent = `Member since Aug 2026 · ID #${memberId} · Premium Scholar`;

  const qrBtn = document.getElementById('qr-btn');
  if (qrBtn) qrBtn.setAttribute('onclick', `showQR('member','${memberId}','${name}')`);

  const DEMO_LOANS = [
    { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', issued: 'Jun 1, 2026', due: 'Jun 22, 2026', overdue: true, fine: 45 },
    { title: 'Dune', author: 'Frank Herbert', issued: 'Jun 15, 2026', due: 'Jul 6, 2026', overdue: false, fine: 0 },
    { title: 'Sapiens', author: 'Yuval Noah Harari', issued: 'Jun 18, 2026', due: 'Jul 9, 2026', overdue: false, fine: 0 }
  ];

  const DEMO_HISTORY = [
    { title: 'Atomic Habits', author: 'James Clear', borrowed: 'Mar 1, 2026', returned: 'Mar 19, 2026', fine: 0 },
    { title: 'The Alchemist', author: 'Paulo Coelho', borrowed: 'Feb 5, 2026', returned: 'Feb 22, 2026', fine: 0 },
    { title: '1984', author: 'George Orwell', borrowed: 'Jan 10, 2026', returned: 'Feb 2, 2026', fine: 15 },
    { title: 'Clean Code', author: 'Robert C. Martin', borrowed: 'Dec 1, 2025', returned: 'Dec 20, 2025', fine: 0 }
  ];

  const loans = isDemo ? DEMO_LOANS : [];
  const history = isDemo ? DEMO_HISTORY : [];
  const totalFine = loans.filter(l => l.overdue).reduce((s, l) => s + l.fine, 0);
  const overdueCount = loans.filter(l => l.overdue).length;

  const statBorrowed = document.getElementById('stat-borrowed');
  if (statBorrowed) statBorrowed.textContent = loans.length;

  const statFine = document.getElementById('stat-fine');
  if (statFine) statFine.textContent = '₹' + totalFine;

  const statFineSub = document.getElementById('stat-fine-sub');
  if (statFineSub) statFineSub.textContent = overdueCount > 0 ? `${overdueCount} overdue book` : 'No dues ✓';

  const statRead = document.getElementById('stat-read');
  if (statRead) statRead.textContent = isDemo ? 47 : 0;

  // Fine notice banner
  const notice = document.getElementById('member-fine-notice');
  if (notice) {
    notice.innerHTML = totalFine > 0 ? `
      <div class="fine-indicator" style="background:rgba(239,68,68,0.1);border:1px solid var(--red);border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-bottom:16px">
        <span style="font-size:20px">⚠️</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--red)">Overdue Fine Outstanding: ₹${totalFine}</div>
          <div style="font-size:11px;color:var(--text2)">"${loans.find(l=>l.overdue)?.title}" is overdue. Please return to counter soon.</div>
        </div>
        <button class="btn btn-sm btn-danger" style="margin-left:auto" onclick="showPayment(${totalFine},'Overdue Fine')">Pay Fine (₹${totalFine})</button>
      </div>` : '';
  }

  // Loans Table
  const loansWrap = document.getElementById('loans-table-wrap');
  if (loansWrap) {
    if (loans.length === 0) {
      loansWrap.innerHTML = `
        <div style="text-align:center;padding:30px 20px;color:var(--text3)">
          <div style="font-size:36px;margin-bottom:8px">📚</div>
          <div style="font-size:14px;font-weight:600;color:var(--text2);margin-bottom:4px">No Active Loans</div>
          <div style="font-size:12px">You have not borrowed any books currently.</div>
          <button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="showPage('catalog')">Browse Catalog →</button>
        </div>`;
    } else {
      loansWrap.innerHTML = `<table>
        <tr><th>Book</th><th>Issued</th><th>Due Date</th><th>Status</th><th>Actions</th></tr>
        ${loans.map(l => `<tr>
          <td><div class="td-main">${l.title}</div><div style="font-size:11px;color:var(--text3)">${l.author}</div></td>
          <td>${l.issued}</td><td>${l.due}</td>
          <td>${l.overdue ? '<span class="badge badge-red">⚠️ Overdue</span>' : '<span class="badge badge-green">✓ On Time</span>'}</td>
          <td><button class="btn btn-sm btn-secondary" onclick="showReturnModal('${l.title.replace(/'/g, "\\'")}',${l.fine})">Return</button></td>
        </tr>`).join('')}
      </table>`;
    }
  }

  // History Table
  const histWrap = document.getElementById('history-table-wrap');
  if (histWrap) {
    histWrap.innerHTML = `<table>
      <tr><th>Book</th><th>Author</th><th>Borrowed</th><th>Returned</th><th>Fine Paid</th></tr>
      ${history.map(h => `<tr>
        <td class="td-main">${h.title}</td><td>${h.author}</td>
        <td>${h.borrowed}</td><td>${h.returned}</td>
        <td>${h.fine > 0 ? `<span class="badge badge-amber">₹${h.fine}</span>` : '<span class="badge badge-green">None</span>'}</td>
      </tr>`).join('')}
    </table>`;
  }
}

// ═════════════════════════════════════════════════════════════════════
// 📚 LIBRARIAN DESK LOGIC
// ═════════════════════════════════════════════════════════════════════
const BOOK_DB = {
  'Dune': { title: 'Dune', author: 'Frank Herbert', isbn: 'ISBN-978-0441013593', fine: '₹0.00', status: 'On Time', issueDate: '21 Jun 2026', dueDate: '28 Jun 2026', todayDate: '28 Jun 2026', daysKept: '7 Days', overdueDays: 0, formula: '0 Overdue Days × ₹5.00/day' },
  'Clean Code': { title: 'Clean Code', author: 'Robert C. Martin', isbn: 'ISBN-978-0132350884', fine: '₹0.00', status: 'On Time', issueDate: '20 Jun 2026', dueDate: '27 Jun 2026', todayDate: '27 Jun 2026', daysKept: '7 Days', overdueDays: 0, formula: '0 Overdue Days × ₹5.00/day' },
  'Atomic Habits': { title: 'Atomic Habits', author: 'James Clear', isbn: 'ISBN-978-0735211292', fine: '₹0.00', status: 'On Time', issueDate: '22 Jun 2026', dueDate: '29 Jun 2026', todayDate: '28 Jun 2026', daysKept: '6 Days', overdueDays: 0, formula: '0 Overdue Days × ₹5.00/day' },
  'Shrimad Bhagavad Gita': { title: 'Shrimad Bhagavad Gita', author: 'Gita Press', isbn: 'ISBN-978-8120800010', fine: '₹0.00', status: 'On Time', issueDate: '15 Jun 2026', dueDate: '22 Jun 2026', todayDate: '22 Jun 2026', daysKept: '7 Days', overdueDays: 0, formula: '0 Overdue Days × ₹5.00/day' },
  'The Pragmatic Programmer': { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: 'ISBN-978-0201616224', fine: '₹45.00', status: 'Overdue (9 Days)', issueDate: '12 May 2026', dueDate: '19 May 2026', todayDate: '28 May 2026', daysKept: '16 Days', overdueDays: 9, formula: '9 Overdue Days × ₹5.00/day' },
  'Sapiens': { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: 'ISBN-978-0062316097', fine: '₹0.00', status: 'On Time', issueDate: '22 Jun 2026', dueDate: '29 Jun 2026', todayDate: '28 Jun 2026', daysKept: '6 Days', overdueDays: 0, formula: '0 Overdue Days × ₹5.00/day' }
};

const INVENTORY_DATA = {
  'Main Branch': {
    total: '1,204', avail: '982', borrowed: '222', low: '2 Titles',
    books: [
      { title: 'Shrimad Bhagavad Gita', author: 'Maharishi Ved Vyasa', isbn: '978-8120800099', rack: 'Rack A-1', total: 10, avail: 8, borrowed: 2, status: 'In Stock', badge: 'badge-green' },
      { title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', isbn: '978-8173711466', rack: 'Rack B-4', total: 5, avail: 3, borrowed: 2, status: 'In Stock', badge: 'badge-green' },
      { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', rack: 'Rack C-2', total: 4, avail: 0, borrowed: 4, status: 'Out of Stock', badge: 'badge-red' },
      { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', rack: 'Rack D-1', total: 3, avail: 1, borrowed: 2, status: 'Low Stock', badge: 'badge-amber' },
      { title: 'The Pragmatic Programmer', author: 'Andrew Hunt', isbn: '978-0135957059', rack: 'Rack D-3', total: 5, avail: 4, borrowed: 1, status: 'In Stock', badge: 'badge-green' },
      { title: 'Dune', author: 'Frank Herbert', isbn: '978-0441013593', rack: 'Rack E-5', total: 6, avail: 5, borrowed: 1, status: 'In Stock', badge: 'badge-green' },
      { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '978-0099590088', rack: 'Rack F-2', total: 4, avail: 3, borrowed: 1, status: 'In Stock', badge: 'badge-green' }
    ]
  }
};

const MEMBER_LOANS_DB = {
  'M10618': {
    name: 'John Doe (#M10618)',
    books: [
      { title: 'The Pragmatic Programmer', text: '📖 The Pragmatic Programmer (Andrew Hunt) - Overdue (₹45)' },
      { title: 'Dune', text: '📖 Dune (Frank Herbert) - On Time (₹0)' }
    ]
  },
  'M00142': {
    name: 'Jane Doe (#M00142)',
    books: [
      { title: 'Sapiens', text: '📖 Sapiens (Yuval Noah Harari) - On Time (₹0)' }
    ]
  },
  'M00089': {
    name: 'Bob Smith (#M00089)',
    books: [
      { title: 'Atomic Habits', text: '📖 Atomic Habits (James Clear) - On Time (₹0)' }
    ]
  }
};

function renderLibrarianDashboard() {
  const issueSelect = document.getElementById('issue-book-select');
  if (issueSelect && issueSelect.value) {
    onBookSelectChange(issueSelect, 'issue-book-preview', 'issue-book');
  }
  const retSelect = document.getElementById('return-book-select');
  if (retSelect && retSelect.value) {
    onBookSelectChange(retSelect, 'return-book-preview', 'return-book');
  }
}

function onBookSelectChange(selectEl, previewId, hiddenInputId) {
  const val = selectEl.value;
  const hiddenInp = document.getElementById(hiddenInputId);
  if (hiddenInp) hiddenInp.value = val;

  const info = BOOK_DB[val] || {
    title: val,
    author: 'Library Collection',
    isbn: 'ISBN-Auto',
    fine: '₹0.00',
    issueDate: '12 Jun 2026',
    dueDate: '19 Jun 2026',
    todayDate: '19 Jun 2026',
    daysKept: '7 Days',
    overdueDays: 0,
    formula: '0 Overdue Days × ₹5.00/day'
  };

  if (previewId === 'issue-book-preview') {
    const titleEl = document.getElementById('issue-preview-title');
    if (titleEl) titleEl.textContent = info.title;
    const subEl = document.getElementById('issue-preview-sub');
    if (subEl) subEl.textContent = `Author: ${info.author} · ${info.isbn}`;
  } else if (previewId === 'return-book-preview') {
    const titleEl = document.getElementById('return-preview-title');
    if (titleEl) titleEl.textContent = info.title;

    const badgeEl = document.getElementById('return-status-badge');
    if (badgeEl) {
      badgeEl.innerHTML = info.overdueDays > 0
        ? `<span class="badge badge-amber" style="font-size:12px;padding:5px 10px">⚠️ ${info.overdueDays} Days Overdue</span>`
        : `<span class="badge badge-green" style="font-size:12px;padding:5px 10px">✓ On Time</span>`;
    }

    const retIssue = document.getElementById('ret-issue-date');
    if (retIssue) retIssue.textContent = info.issueDate;
    const retDue = document.getElementById('ret-due-date');
    if (retDue) retDue.textContent = info.dueDate;
    const retToday = document.getElementById('ret-today-date');
    if (retToday) retToday.textContent = info.todayDate;
    const retDays = document.getElementById('ret-total-days');
    if (retDays) {
      retDays.textContent = info.daysKept;
      retDays.style.color = info.overdueDays > 0 ? 'var(--amber)' : 'var(--green)';
    }

    const retFormula = document.getElementById('ret-fine-formula');
    if (retFormula) retFormula.textContent = info.formula;

    const fp = document.getElementById('fine-preview');
    if (fp) {
      fp.textContent = info.fine;
      fp.style.color = info.fine !== '₹0.00' ? 'var(--amber)' : 'var(--green)';
    }
  }
}

function filterReturnBooksByMember(query) {
  const q = (query || '').toUpperCase().trim();
  let memberData = null;
  for (let key in MEMBER_LOANS_DB) {
    if (key.includes(q) || MEMBER_LOANS_DB[key].name.toUpperCase().includes(q)) {
      memberData = MEMBER_LOANS_DB[key];
      break;
    }
  }
  if (!memberData) memberData = MEMBER_LOANS_DB['M10618'];

  const sel = document.getElementById('return-book-select');
  if (sel && memberData.books) {
    sel.innerHTML = memberData.books.map(b => `<option value="${b.title}">${b.text}</option>`).join('');
    onBookSelectChange(sel, 'return-book-preview', 'return-book');
  }
}

function issueBook() {
  const member = document.getElementById('issue-member')?.value || 'John Doe';
  const book = document.getElementById('issue-book')?.value || 'Dune';
  const due = document.getElementById('issue-due')?.value || '2026-07-28';
  notify(`⚡ Book "${book}" successfully issued to ${member}! Due Date: ${due}`, 'success');
}

function processReturn() {
  const member = document.getElementById('return-member-input')?.value || 'John Doe';
  const book = document.getElementById('return-book')?.value || 'The Pragmatic Programmer';
  notify(`📥 1-Click Return Complete for "${book}" (${member})!`, 'success');
}

function filterInventoryBranch(branch = 'Main Branch') {
  const data = INVENTORY_DATA[branch] || INVENTORY_DATA['Main Branch'];
  const titleEl = document.getElementById('inv-branch-title');
  if (titleEl) titleEl.textContent = branch;

  const totalEl = document.getElementById('inv-stat-total');
  if (totalEl) totalEl.textContent = data.total;

  const availEl = document.getElementById('inv-stat-avail');
  if (availEl) availEl.textContent = data.avail;

  const borEl = document.getElementById('inv-stat-borrowed');
  if (borEl) borEl.textContent = data.borrowed;

  const lowEl = document.getElementById('inv-stat-low');
  if (lowEl) lowEl.textContent = data.low;

  renderInventoryTable(data.books);
}

function renderInventoryTable(books) {
  const tbody = document.getElementById('inv-tbody');
  if (!tbody) return;
  tbody.innerHTML = books.map(b => `
    <tr>
      <td>
        <div class="td-main">${b.title}</div>
        <div style="font-size:11px;color:var(--text3)">${b.author}</div>
      </td>
      <td style="font-family:monospace;font-size:12px">${b.isbn}</td>
      <td><span class="badge badge-navy">${b.rack}</span></td>
      <td style="font-weight:600">${b.total} copies</td>
      <td style="color:var(--green);font-weight:600">${b.avail} available</td>
      <td style="color:var(--amber)">${b.borrowed} borrowed</td>
      <td><span class="badge ${b.badge}">${b.status}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn btn-sm btn-ghost" onclick="showAddCopyModal('${b.title.replace(/'/g, "\\'")}')">+ Copy</button>
          <button class="btn btn-sm btn-secondary" onclick="showTransferRequestModal('${b.title.replace(/'/g, "\\'")}')">📩 Req. Transfer</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterInventoryTable() {
  const query = document.getElementById('inv-search')?.value.toLowerCase() || '';
  const data = INVENTORY_DATA['Main Branch'];
  const filtered = data.books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query) || b.isbn.toLowerCase().includes(query));
  renderInventoryTable(filtered);
}

function showAddCopyModal(bookTitle) {
  showModal('➕ Add Physical Copies to Stock', `
    <div style="font-size:13px;margin-bottom:14px;color:var(--text2)">
      Add physical copies of <strong style="color:var(--teal)">"${bookTitle}"</strong> to Main Branch inventory.
    </div>
    <div class="form-group">
      <label class="form-label">Number of Copies:</label>
      <input type="number" id="add-copies-input" class="form-input" value="1" min="1" max="50">
    </div>
    <div class="form-group">
      <label class="form-label">Shelf / Rack Placement:</label>
      <input type="text" id="add-rack-input" class="form-input" value="Rack A-1">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmAddCopies('${bookTitle.replace(/'/g, "\\'")}', 'Main Branch')">Add to Stock</button>
    </div>
  `);
}

function confirmAddCopies(bookTitle, branch) {
  const qty = parseInt(document.getElementById('add-copies-input').value) || 1;
  const rack = document.getElementById('add-rack-input').value || 'Rack A-1';
  const data = INVENTORY_DATA[branch] || INVENTORY_DATA['Main Branch'];
  if (data) {
    let book = data.books.find(b => b.title === bookTitle);
    if (!book) {
      book = { title: bookTitle, author: 'Author', isbn: '978-0000000000', rack: rack, total: 0, avail: 0, borrowed: 0, status: 'In Stock', badge: 'badge-green' };
      data.books.push(book);
    }
    book.total += qty;
    book.avail += qty;
    book.rack = rack;
    closeModal();
    filterInventoryBranch('Main Branch');
    notify(`Added ${qty} copies of "${bookTitle}" to Main Branch!`, 'success');
  }
}

function showTransferRequestModal(bookTitle) {
  showModal('📩 Submit Inter-Branch Transfer Request', `
    <div style="font-size:13px;margin-bottom:14px;color:var(--text2)">
      Request stock transfer of <strong style="color:var(--teal)">"${bookTitle}"</strong> from another campus branch.
    </div>
    <div class="form-group">
      <label class="form-label">Source Branch:</label>
      <select id="transfer-from-branch" class="form-select">
        <option value="North Branch">North Branch</option>
        <option value="East Wing">East Wing</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Number of Copies:</label>
      <input type="number" id="transfer-req-qty" class="form-input" value="2" min="1" max="20">
    </div>
    <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px">
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="confirmTransferRequest('${bookTitle.replace(/'/g, "\\'")}')">Send Request</button>
    </div>
  `);
}

function confirmTransferRequest(bookTitle) {
  const target = document.getElementById('transfer-from-branch')?.value || 'North Branch';
  const qty = parseInt(document.getElementById('transfer-req-qty')?.value) || 1;
  closeModal();
  notify(`Stock Transfer Request for ${qty} copies of "${bookTitle}" sent to ${target}!`, 'success');
}

function simulateQRScan(mode) {
  const titleText = mode === 'member' ? '🪪 Barcode / QR Scanner (Student Pass)' : '📷 Barcode / QR Scanner (Book ISBN)';
  const btnText = mode === 'member' ? '⚡ Auto-Detect Member (#M10618)' : '⚡ Auto-Detect Book Barcode';

  showModal(titleText, `
    <div style="text-align:center;padding:12px">
      <div style="width:220px;height:140px;margin:0 auto 14px;background:#000;border:2px solid var(--teal);border-radius:12px;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="font-size:40px;opacity:0.85">${mode === 'member' ? '🪪' : '🔲'}</div>
        <div style="font-size:11px;color:var(--teal);margin-top:6px;font-weight:600">🔌 USB Laser Scanner Gun Ready</div>
        <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#10b981;box-shadow:0 0 15px #10b981;animation:scanLine 1.5s infinite ease-in-out"></div>
      </div>
      <style>
        @keyframes scanLine { 0% { top: 0%; } 50% { top: 90%; } 100% { top: 0%; } }
      </style>
      <div style="background:rgba(13,148,136,0.1);border:1px solid var(--teal);border-radius:8px;padding:10px;font-size:12px;margin-bottom:14px;text-align:left">
        <strong style="color:var(--teal)">🔌 Barcode Scanner Ready:</strong><br>
        Aim scanner gun at book barcode or student ID.
      </div>
      <button class="btn btn-primary" style="width:100%;padding:10px;font-weight:700" onclick="completeQRScan('${mode}')">${btnText}</button>
    </div>
  `);
}

function completeQRScan(mode) {
  closeModal();
  if (mode === 'member') {
    const inp = document.getElementById('return-member-input');
    if (inp) {
      inp.value = 'M10618 (John Doe)';
      filterReturnBooksByMember('M10618');
    }
    notify('✅ Student Pass Scanned! John Doe (#M10618) active loans loaded.', 'success');
  } else if (mode === 'issue') {
    const select = document.getElementById('issue-book-select');
    if (select) {
      select.value = 'Clean Code';
      onBookSelectChange(select, 'issue-book-preview', 'issue-book');
    }
    notify('✅ QR Code Scanned! "Clean Code" auto-filled.', 'success');
  } else {
    const select = document.getElementById('return-book-select');
    if (select) {
      select.value = 'The Pragmatic Programmer';
      onBookSelectChange(select, 'return-book-preview', 'return-book');
    }
    notify('✅ QR Code Scanned! "The Pragmatic Programmer" auto-filled.', 'success');
  }
}

function handleCSVSelect(event) {
  const file = event.target.files[0];
  if (file) {
    const label = document.getElementById('csv-filename-label');
    if (label) label.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  }
}

function uploadCSV() {
  const p = document.getElementById('import-progress');
  const bar = document.getElementById('import-bar');
  const st = document.getElementById('import-status');
  if (!p) return;
  p.style.display = 'block';
  setTimeout(() => { if (bar) bar.style.width = '40%'; if (st) st.textContent = 'Validating records...'; }, 200);
  setTimeout(() => { if (bar) bar.style.width = '70%'; if (st) st.textContent = 'Fetching ISBN metadata (31/47)...'; }, 1000);
  setTimeout(() => {
    if (bar) bar.style.width = '100%';
    if (st) st.textContent = 'Done! 47 physical books imported successfully.';
    notify('47 books imported into database!', 'success');
  }, 2000);
}

function downloadSampleCSV() {
  const csvContent = 'data:text/csv;charset=utf-8,Title,Author,Genre,ISBN,Copies,Rack\nRashmirathi,Ramdhari Singh Dinkar,Poetry,9788170281234,8,Rack A-1\nClean Code,Robert C. Martin,Technology,9780132350884,5,Rack D-1';
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'Alexandria_Sample_Books.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// ═════════════════════════════════════════════════════════════════════
// ⚙️ ADMINISTRATOR DASHBOARD LOGIC
// ═════════════════════════════════════════════════════════════════════
const REVENUE_TRANSACTIONS = [
  { txnId: 'TXN-9021', name: 'Jane Doe', item: 'The Pragmatic Programmer', type: 'rent', cat: 'Book Rent Fee', badge: 'badge-teal', amount: '₹120', date: 'Aug 11, 2026', mode: 'Razorpay Online' },
  { txnId: 'TXN-9018', name: 'Priya Sharma', item: 'Wings of Fire', type: 'rent', cat: 'Book Rent Fee', badge: 'badge-teal', amount: '₹80', date: 'Aug 10, 2026', mode: 'Cash at Counter' },
  { txnId: 'TXN-9015', name: 'John Doe', item: 'VIP Scholar Plan Subscription', type: 'plan', cat: 'Membership Plan', badge: 'badge-green', amount: '₹999', date: 'Aug 09, 2026', mode: 'Razorpay Online' },
  { txnId: 'TXN-9012', name: 'Bob Smith', item: 'Atomic Habits Overdue Fine', type: 'fine', cat: 'Overdue Fine', badge: 'badge-amber', amount: '₹45', date: 'Aug 08, 2026', mode: 'Cash at Counter' },
  { txnId: 'TXN-9009', name: 'Vikram Singh', item: 'Shrimad Bhagavad Gita', type: 'rent', cat: 'Book Rent Fee', badge: 'badge-teal', amount: '₹150', date: 'Aug 07, 2026', mode: 'Razorpay Online' }
];

let BRANCHES_DATA = [
  { id: 'b1', name: 'Main Campus Central Library', address: 'Central Block, 2nd Floor (Main Campus)', capacity: 1500, books: 1204, status: 'Active' },
  { id: 'b2', name: 'Science & Engineering Library', address: 'Technology Building, Room 302', capacity: 1000, books: 843, status: 'Active' },
  { id: 'b3', name: 'Law & Management Library', address: 'North Quad, Ground Floor', capacity: 800, books: 420, status: 'Maintenance' }
];

function renderAdminDashboard() {
  loadAdminMembers();
  renderBranches();
  filterRevenueLedger('all');
}

async function loadAdminMembers() {
  const tbody = document.getElementById('admin-members-table');
  if (!tbody) return;
  try {
    const members = typeof fetchMembers === 'function' ? await fetchMembers() : FALLBACK_MEMBERS;
    if (!members || members.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text3)">No members found.</td></tr>`;
      return;
    }
    tbody.innerHTML = members.map(m => `
      <tr>
        <td class="td-main">${m.firstName} ${m.lastName}</td>
        <td>${m.email}</td>
        <td><span class="badge ${m.role === 'admin' ? 'badge-red' : m.role === 'librarian' ? 'badge-amber' : 'badge-teal'}">${(m.role || 'member').toUpperCase()}</span></td>
        <td><span class="badge badge-navy">${m.membershipType || 'Standard'}</span></td>
        <td><span class="badge ${m.status === 'Suspended' ? 'badge-red' : 'badge-green'}">${m.status || 'Active'}</span></td>
        <td>
          <button class="btn btn-sm btn-ghost" onclick="changeUserRole('${m._id || m.id}', '${m.firstName}')">Role</button>
          <button class="btn btn-sm ${m.status === 'Suspended' ? 'btn-primary' : 'btn-danger'}" onclick="toggleUserStatus('${m._id || m.id}', '${m.status}')">${m.status === 'Suspended' ? 'Activate' : 'Suspend'}</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Failed to load admin members:', e);
  }
}

function changeUserRole(id, name) {
  showModal(`👥 Change Role — ${name}`, `
    <div class="form-group">
      <label class="form-label">Select New System Role</label>
      <select class="form-select" id="new-user-role">
        <option value="member">Member</option>
        <option value="librarian">Librarian Staff</option>
        <option value="admin">Administrator</option>
      </select>
    </div>
    <button class="btn btn-primary" style="width:100%;margin-top:10px" onclick="saveUserRole('${id}')">Save Role</button>
  `);
}

async function saveUserRole(id) {
  const role = document.getElementById('new-user-role')?.value || 'member';
  notify(`Role updated to ${role.toUpperCase()}!`, 'success');
  closeModal();
  loadAdminMembers();
}

function toggleUserStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
  notify(`Account status changed to ${newStatus}!`, 'info');
  loadAdminMembers();
}

function renderBranches() {
  const container = document.getElementById('branches-container');
  if (!container) return;

  container.innerHTML = BRANCHES_DATA.map(b => {
    const pct = Math.min(100, Math.round((b.books / b.capacity) * 100));
    const statusBadge = b.status === 'Active' ? 'badge-green' : 'badge-amber';
    const fillBg = pct > 80 ? 'var(--red)' : pct > 60 ? 'var(--amber)' : 'var(--teal)';

    return `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <span class="card-title" style="font-size:15px">🏛 ${b.name}</span>
          <span class="badge ${statusBadge}">${b.status}</span>
        </div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:12px">📍 ${b.address}</div>
        <div class="prog-bar" style="margin-bottom:6px">
          <div class="prog-fill" style="width:${pct}%;background:${fillBg}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text3);margin-bottom:12px">
          <span>📚 ${b.books.toLocaleString()} / ${b.capacity.toLocaleString()} books</span>
          <span><strong>${pct}%</strong> capacity</span>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-primary btn-sm" style="flex:1" onclick="openEditBranchModal('${b.id}')">✏️ Edit Settings</button>
          <button class="btn btn-ghost btn-sm" onclick="toggleBranchStatus('${b.id}')">${b.status === 'Active' ? 'Set Maintenance' : 'Set Active'}</button>
        </div>
      </div>
    `;
  }).join('');
}

function openEditBranchModal(id) {
  const b = BRANCHES_DATA.find(x => x.id === id);
  if (!b) return;

  showModal(`✏️ Edit Branch — ${b.name}`, `
    <div class="form-group">
      <label class="form-label">Branch Name *</label>
      <input class="form-input" id="edit-b-name" value="${b.name}">
    </div>
    <div class="form-group">
      <label class="form-label">Location Address *</label>
      <input class="form-input" id="edit-b-addr" value="${b.address}">
    </div>
    <div class="form-row" style="display:flex;gap:10px">
      <div class="form-group" style="flex:1">
        <label class="form-label">Capacity</label>
        <input class="form-input" type="number" id="edit-b-cap" value="${b.capacity}">
      </div>
      <div class="form-group" style="flex:1">
        <label class="form-label">Active Books</label>
        <input class="form-input" type="number" id="edit-b-books" value="${b.books}">
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-primary" style="flex:1" onclick="saveBranchEdit('${b.id}')">Save Changes</button>
      <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function saveBranchEdit(id) {
  const b = BRANCHES_DATA.find(x => x.id === id);
  if (!b) return;
  b.name = document.getElementById('edit-b-name').value.trim() || b.name;
  b.address = document.getElementById('edit-b-addr').value.trim() || b.address;
  b.capacity = parseInt(document.getElementById('edit-b-cap').value) || b.capacity;
  b.books = parseInt(document.getElementById('edit-b-books').value) || b.books;
  closeModal();
  renderBranches();
  notify(`Branch "${b.name}" updated!`, 'success');
}

function toggleBranchStatus(id) {
  const b = BRANCHES_DATA.find(x => x.id === id);
  if (!b) return;
  b.status = b.status === 'Active' ? 'Maintenance' : 'Active';
  renderBranches();
  notify(`Branch "${b.name}" is now ${b.status}!`, 'info');
}

function filterRevenueLedger(filterType = 'all') {
  const tbody = document.getElementById('rev-tbody');
  if (!tbody) return;
  const filtered = filterType === 'all' ? REVENUE_TRANSACTIONS : REVENUE_TRANSACTIONS.filter(t => t.type === filterType);
  tbody.innerHTML = filtered.map(t => `
    <tr>
      <td style="font-family:monospace;font-size:12px;color:var(--text3)">${t.txnId}</td>
      <td style="font-weight:600">${t.name}</td>
      <td>${t.item}</td>
      <td><span class="badge ${t.badge}">${t.cat}</span></td>
      <td style="font-weight:700;color:var(--teal)">${t.amount}</td>
      <td style="font-size:12px;color:var(--text3)">${t.date}</td>
      <td><span class="badge badge-navy">${t.mode}</span></td>
    </tr>
  `).join('');
}

// ═════════════════════════════════════════════════════════════════════
// 🔐 AUTHENTICATION & LOGIN LOGIC
// ═════════════════════════════════════════════════════════════════════
let currentAuthRole = 'member';

const DEMO_CREDENTIALS = {
  member:    { email: 'john.doe@email.com', password: 'password123', name: 'John Doe' },
  librarian: { email: 'librarian@alexandria.lib', password: 'lib123', name: 'Librarian Staff' },
  admin:     { email: 'ashok.admin@alexandria.edu', password: 'admin123', name: 'Dr. Ashok' }
};

function selectAuthTab(role, el) {
  currentAuthRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const emailInp = document.getElementById('auth-email');
  const pwInp = document.getElementById('auth-password');
  const roleLabel = document.getElementById('auth-role-desc');

  if (emailInp) emailInp.value = '';
  if (pwInp) pwInp.value = '';

  if (roleLabel) {
    if (role === 'admin') roleLabel.textContent = 'Administrator Portal — System settings & user management';
    else if (role === 'librarian') roleLabel.textContent = 'Library Staff Portal — Issue/return counter & stock';
    else roleLabel.textContent = 'Member Portal — Personal reading history, active loans & fines';
  }
}

function quickLogin(role) {
  const cred = DEMO_CREDENTIALS[role] || DEMO_CREDENTIALS.member;
  doLogin(role, cred.email, cred.name);
}

function doLogin(role, email, name) {
  localStorage.setItem('user_role', role);
  localStorage.setItem('user_email', email);
  localStorage.setItem('user_name', name);
  notify(`✅ Welcome back, ${name}! (${role.toUpperCase()})`, 'success');
  updateHeaderUI();

  // Navigate directly to user's dashboard in the SPA
  setTimeout(() => {
    if (role === 'admin') showPage('admin');
    else if (role === 'librarian') showPage('librarian');
    else showPage('member');
  }, 300);
}

async function handleAuth(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email')?.value.trim().toLowerCase();
  const password = document.getElementById('auth-password')?.value;
  const role = currentAuthRole;

  // 1. Check demo credentials
  const cred = DEMO_CREDENTIALS[role];
  if (cred && email === cred.email.toLowerCase() && password === cred.password) {
    doLogin(role, cred.email, cred.name);
    return;
  }

  // 2. Try backend API login
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      doLogin(data.role || role, data.email, data.name || email.split('@')[0]);
      return;
    }
    shakeAuthForm();
    notify(`❌ ${data.message || 'Login failed'}`, 'error');
  } catch (e) {
    // Fallback: check localStorage
    const stored = JSON.parse(localStorage.getItem('registered_members') || '[]');
    const found = stored.find(m => m.email.toLowerCase() === email && m.password === password);
    if (found) {
      doLogin(found.role || 'member', found.email, found.name);
      return;
    }
    shakeAuthForm();
    notify('❌ Incorrect email or password. Use 1-Click Bypass buttons for instant access.', 'error');
  }
}

function shakeAuthForm() {
  const form = document.getElementById('auth-form');
  if (!form) return;
  form.style.animation = 'none';
  form.offsetHeight;
  form.style.animation = 'shake 0.4s ease';
  setTimeout(() => form.style.animation = '', 500);
}

function togglePw(id, btn) {
  const inp = document.getElementById(id);
  if (!inp) return;
  if (inp.type === 'password') {
    inp.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    inp.type = 'password';
    if (btn) btn.textContent = '👁';
  }
}

function checkStrength(pw) {
  const fill = document.getElementById('strength-fill');
  const label = document.getElementById('strength-label');
  if (!fill) return;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { pct: '0%', color: '', text: '' },
    { pct: '25%', color: 'var(--red)', text: 'Weak' },
    { pct: '50%', color: 'var(--amber)', text: 'Fair' },
    { pct: '75%', color: 'var(--teal)', text: 'Good' },
    { pct: '100%', color: 'var(--green)', text: 'Strong' }
  ];
  const item = map[score] || map[0];
  fill.style.width = item.pct;
  fill.style.background = item.color;
  if (label) {
    label.textContent = item.text;
    label.style.color = item.color;
  }
}

// Register Modal Flow
function openRegisterModal() {
  const modal = document.getElementById('register-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('open');
    document.getElementById('reg-step-1')?.classList.add('active');
    document.getElementById('reg-step-2')?.classList.remove('active');
  }
}

function closeRegisterModal() {
  const modal = document.getElementById('register-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open');
  }
}

function submitRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const pw = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (pw !== confirm) {
    notify('Passwords do not match!', 'error');
    return;
  }

  const newMemberId = 'M' + Math.floor(10000 + Math.random() * 90000);
  const registered = JSON.parse(localStorage.getItem('registered_members') || '[]');
  registered.push({ name, email, password: pw, role: 'member', memberId: newMemberId });
  localStorage.setItem('registered_members', JSON.stringify(registered));

  const idEl = document.getElementById('reg-member-id');
  if (idEl) idEl.textContent = `Library Member ID: #${newMemberId}`;

  document.getElementById('reg-step-1')?.classList.remove('active');
  document.getElementById('reg-step-2')?.classList.add('active');
  notify('🎉 Account registered successfully!', 'success');
}

function goToLogin() {
  closeRegisterModal();
  showPage('login');
}

// Forgot Password Flow
function openForgotModal() {
  const modal = document.getElementById('forgot-modal');
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('open');
    document.getElementById('fp-step-1')?.classList.add('active');
    document.getElementById('fp-step-2')?.classList.remove('active');
    document.getElementById('fp-step-3')?.classList.remove('active');
    document.getElementById('fp-step-4')?.classList.remove('active');
  }
}

function closeForgotModal() {
  const modal = document.getElementById('forgot-modal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('open');
  }
}

function sendOtp(e) {
  e.preventDefault();
  const email = document.getElementById('fp-email')?.value.trim();
  notify(`OTP sent to ${email} (Demo OTP: 1234)`, 'success');
  document.getElementById('fp-step-1')?.classList.remove('active');
  document.getElementById('fp-step-2')?.classList.add('active');
}

function moveToNext(current, nextFieldId) {
  if (current.value.length >= 1) {
    const next = document.getElementById(nextFieldId);
    if (next) next.focus();
  }
}

function handleOtpKey(e, current, prevFieldId) {
  if (e.key === 'Backspace' && current.value === '') {
    const prev = document.getElementById(prevFieldId);
    if (prev) prev.focus();
  }
}

function submitOtp(e) {
  e.preventDefault();
  notify('OTP verified successfully!', 'success');
  document.getElementById('fp-step-2')?.classList.remove('active');
  document.getElementById('fp-step-3')?.classList.add('active');
}

function submitNewPw(e) {
  e.preventDefault();
  const p1 = document.getElementById('fp-new-pw')?.value;
  const p2 = document.getElementById('fp-confirm-pw')?.value;
  if (p1 !== p2) {
    notify('Passwords do not match!', 'error');
    return;
  }
  notify('Password reset successfully!', 'success');
  document.getElementById('fp-step-3')?.classList.remove('active');
  document.getElementById('fp-step-4')?.classList.add('active');
}

// ═════════════════════════════════════════════════════════════════════
// 🚀 INITIALIZATION ON DOM READY
// ═════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize Header session & role
  updateHeaderUI();

  // 2. Fetch Books & render catalog
  try {
    if (typeof loadInitialData === 'function') {
      await loadInitialData();
    } else if (typeof fetchBooks === 'function') {
      BOOKS = await fetchBooks();
    }
    if (typeof renderBooks === 'function' && typeof BOOKS !== 'undefined') {
      renderBooks(BOOKS, 'book-grid');
      const countEl = document.getElementById('book-count');
      if (countEl) countEl.textContent = `${BOOKS.length} books found`;
    }
  } catch (e) {
    console.warn('Initial data load notice:', e);
  }

  // 3. Route according to URL Hash (#member, #librarian, #admin, #login, #catalog)
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (['member', 'librarian', 'admin', 'login', 'catalog'].includes(hash)) {
    showPage(hash);
  } else {
    showPage('catalog');
  }

  // 4. Hash change listener
  window.addEventListener('hashchange', () => {
    const newHash = window.location.hash.replace('#', '').toLowerCase();
    if (['member', 'librarian', 'admin', 'login', 'catalog'].includes(newHash)) {
      showPage(newHash);
    }
  });
});
