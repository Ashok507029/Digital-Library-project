// ── Navigation & Page Management ────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('page-' + id)?.classList.add('active');
  const btns = document.querySelectorAll('.nav-btn');
  btns.forEach(b => { if (b.textContent.toLowerCase().includes(id.slice(0, 3))) b.classList.add('active'); });
  if (id === 'analytics') setTimeout(renderCharts, 100);
}

function memberTab(el, id) {
  document.querySelectorAll('#page-member .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['mt-current','mt-history','mt-ebooks','mt-plans'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
}

function libTab(el, id) {
  document.querySelectorAll('#page-librarian .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['lt-issue','lt-members','lt-fines','lt-inventory','lt-import'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
}

function adminTab(el, id) {
  document.querySelectorAll('#page-admin .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['at-roles','at-branches','at-payment','at-notifs'].forEach(i => {
    const el2 = document.getElementById(i);
    if (el2) el2.style.display = i === id ? 'block' : 'none';
  });
}

// ── Bulk Import Simulation ─────────────────────────────────────────
function simulateImport() {
  const p   = document.getElementById('import-progress');
  const bar = document.getElementById('import-bar');
  const st  = document.getElementById('import-status');
  if (!p) return;
  p.style.display = 'block';
  setTimeout(() => { bar.style.width = '40%'; st.textContent = 'Validating records...'; },           200);
  setTimeout(() => { bar.style.width = '70%'; st.textContent = 'Fetching ISBN metadata (31/47)...'; }, 1200);
  setTimeout(() => {
    bar.style.width = '100%';
    st.textContent  = 'Done! 47 books imported, 2 duplicates skipped.';
    notify('47 books imported successfully!', 'success');
  }, 2400);
}

// ── Charts ─────────────────────────────────────────────────────────
let chartsRendered = false;

async function renderCharts() {
  if (chartsRendered) return;
  chartsRendered = true;

  try {
    const res = await fetch(`${API_BASE}/analytics`);
    const analytics = await res.json();

    const genreLabels = analytics.genreStats ? analytics.genreStats.map(g => g._id) : ['Fiction','Technology','Science','History','Philosophy','Biography'];
    const genreCounts = analytics.genreStats ? analytics.genreStats.map(g => g.count) : [12, 8, 4, 3, 2, 2];
    const colors = ['#0d9488','#1e3a5f','#d97706','#16a34a','#7c3aed','#dc2626','#0ea5e9','#f59e0b'];

    const ge = document.getElementById('genre-chart');
    if (ge && window.Chart) new Chart(ge, {
      type: 'doughnut',
      data: {
        labels: genreLabels,
        datasets: [{ data: genreCounts, backgroundColor: colors.slice(0, genreLabels.length) }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels:{ color:'#94a3b8', font:{ size:11 } }, position:'right' } }
      }
    });

    const totalBooksEl = document.getElementById('stat-total-books');
    if (totalBooksEl && analytics.summary) totalBooksEl.textContent = analytics.summary.totalBooks;

    const totalMembersEl = document.getElementById('stat-total-members');
    if (totalMembersEl && analytics.summary) totalMembersEl.textContent = analytics.summary.totalMembers;

  } catch (error) {
    console.warn('Analytics API unavailable, charts loaded with default data:', error);
  }

  const co = document.getElementById('checkout-chart');
  if (co && window.Chart) new Chart(co, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun'],
      datasets: [
        { label:'Books Issued',  data:[280,310,350,380,420,389], backgroundColor:'#0d9488', borderRadius:4 },
        { label:'Returned',      data:[260,290,340,360,400,350], backgroundColor:'#1e3a5f', borderRadius:4 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color:'#94a3b8', font:{ size:11 } } } },
      scales: {
        x: { ticks:{ color:'#94a3b8' }, grid:{ color:'#2d3f5c' } },
        y: { ticks:{ color:'#94a3b8' }, grid:{ color:'#2d3f5c' } }
      }
    }
  });
}

// ── Role & Session Handling ────────────────────────────────────────
function checkPageAccess() {
  let role = localStorage.getItem('user_role');
  if (!role) {
    role = 'member';
    localStorage.setItem('user_role', 'member');
  }

  const path = window.location.pathname.toLowerCase();

  // Strict Role Protection
  if (path.endsWith('admin.html') && role !== 'admin') {
    alert(`⛔ Access Denied!\n\nThe Admin Panel is restricted to Administrators only.`);
    window.location.href = 'index.html';
    return false;
  }
  if (path.endsWith('librarian.html') && role !== 'librarian' && role !== 'admin') {
    alert(`⛔ Access Denied!\n\nThe Librarian Desk is restricted to Library Staff.`);
    window.location.href = 'index.html';
    return false;
  }
  if (path.endsWith('member.html') && role !== 'member' && role !== 'admin') {
    alert(`⛔ Access Denied!\n\nMy Account is for Library Members.`);
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

function initHeaderSession() {
  const role = localStorage.getItem('user_role') || 'member';
  const name = localStorage.getItem('user_name') || 'User';

  // 1. Role Badge & Avatar Updates
  const roleEl = document.getElementById('header-role') || document.getElementById('role-label');
  if (roleEl) {
    roleEl.textContent = role.toUpperCase();
    if (role === 'admin') { roleEl.style.background = 'var(--red)'; roleEl.style.color = 'white'; }
    else if (role === 'librarian') { roleEl.style.background = 'var(--amber)'; roleEl.style.color = 'white'; }
    else if (role === 'member') { roleEl.style.background = 'var(--teal)'; roleEl.style.color = 'white'; }
    else { roleEl.style.background = 'var(--navy)'; roleEl.style.color = 'var(--text3)'; }
  }

  const avatarEl = document.getElementById('header-avatar') || document.getElementById('user-avatar');
  if (avatarEl) {
    avatarEl.textContent = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // 2. Strict Single-Role Navbar Rendering (Zero Clutter!)
  const navContainer = document.querySelector('.header .nav');
  if (navContainer) {
    const path = window.location.pathname.toLowerCase();
    const isIndex = path.endsWith('index.html') || path.endsWith('/') || path === '';
    let navHtml = `<a class="nav-btn ${isIndex?'active':''}" href="index.html">Catalog</a>`;

    if (role === 'member') {
      navHtml += `<a class="nav-btn ${path.endsWith('member.html')?'active':''}" href="member.html">My Account</a>`;
    } else if (role === 'librarian') {
      navHtml += `<a class="nav-btn ${path.endsWith('librarian.html')?'active':''}" href="librarian.html">Librarian Desk</a>`;
    } else if (role === 'admin') {
      navHtml += `<a class="nav-btn ${path.endsWith('admin.html')?'active':''}" href="admin.html">Admin Panel</a>`;
    }

    navHtml += `<a class="nav-btn" href="login.html" onclick="localStorage.removeItem('user_role')" style="color:var(--red);font-weight:600">🚪 Logout</a>`;
    navContainer.innerHTML = navHtml;
  }
}

// ── DOMContentLoaded — Initialise everything ───────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  if (!checkPageAccess()) return;
  initHeaderSession();

  try {
    await loadInitialData();
    renderBooks(BOOKS, 'book-grid');
    const countEl = document.getElementById('book-count');
    if (countEl) countEl.textContent = `${BOOKS.length} books found`;
  } catch (error) {
    console.warn('Using client fallback data:', error);
  }

  // Return-book fine preview
  const rb = document.getElementById('return-book');
  if (rb) rb.addEventListener('input', () => {
    const overdue = rb.value.toLowerCase().includes('pragmatic') || rb.value.toLowerCase().includes('algo');
    document.getElementById('fine-preview').textContent = overdue ? '₹45.00' : '₹0.00';
    document.getElementById('fine-preview').style.color = overdue ? 'var(--amber)' : 'var(--green)';
  });
});
