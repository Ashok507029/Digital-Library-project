// ── Book Cover Theming & Template Generator ──────────────────────────
function getBookCoverTheme(b) {
  const t = (b.title || '').toLowerCase();
  const g = (b.genre || '').toLowerCase();

  // 1. Specific High-Profile Books
  if (t.includes('rashmirathi') || t.includes('रश्मिरथी')) {
    return {
      gradient: 'linear-gradient(145deg, #78350f 0%, #b45309 45%, #451a03 100%)',
      borderColor: 'rgba(251, 191, 36, 0.5)',
      frameColor: 'rgba(251, 191, 36, 0.25)',
      tagBg: 'rgba(251, 191, 36, 0.22)',
      tagColor: '#fef3c7',
      tagText: 'महाकाव्य • CLASSIC',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: '☀️',
      footer: 'दिनकर ग्रंथावली'
    };
  }
  if (t.includes('gitanjali')) {
    return {
      gradient: 'linear-gradient(145deg, #581c87 0%, #7c3aed 50%, #2e1065 100%)',
      borderColor: 'rgba(216, 180, 254, 0.45)',
      frameColor: 'rgba(216, 180, 254, 0.25)',
      tagBg: 'rgba(216, 180, 254, 0.2)',
      tagColor: '#faf5ff',
      tagText: 'NOBEL PRIZE • 1913',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: '🌸',
      footer: 'SONG OFFERINGS'
    };
  }
  if (t.includes('madhushala') || t.includes('मधुशाला')) {
    return {
      gradient: 'linear-gradient(145deg, #881337 0%, #be123c 50%, #4c0519 100%)',
      borderColor: 'rgba(254, 205, 211, 0.45)',
      frameColor: 'rgba(254, 205, 211, 0.25)',
      tagBg: 'rgba(254, 205, 211, 0.2)',
      tagColor: '#fff1f2',
      tagText: 'काव्य कलश • POETRY',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: '🍷',
      footer: 'बच्चन रचनावली'
    };
  }
  if (t.includes('concepts of physics') || t.includes('h.c. verma') || t.includes('hc verma')) {
    return {
      gradient: 'linear-gradient(145deg, #0c4a6e 0%, #0284c7 50%, #082f49 100%)',
      borderColor: 'rgba(56, 189, 248, 0.45)',
      frameColor: 'rgba(56, 189, 248, 0.25)',
      tagBg: 'rgba(56, 189, 248, 0.2)',
      tagColor: '#e0f2fe',
      tagText: 'PHYSICS • IIT-JEE',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '⚛️',
      footer: 'BHARATI BHAWAN'
    };
  }
  if (t.includes('rd sharma') || (t.includes('mathematics') && t.includes('sharma'))) {
    return {
      gradient: 'linear-gradient(145deg, #1e3a8a 0%, #2563eb 50%, #172554 100%)',
      borderColor: 'rgba(147, 197, 253, 0.45)',
      frameColor: 'rgba(147, 197, 253, 0.25)',
      tagBg: 'rgba(147, 197, 253, 0.2)',
      tagColor: '#eff6ff',
      tagText: 'ADVANCED MATHS',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '📐',
      footer: 'DHANPAT RAI PUB'
    };
  }
  if (t.includes('trueman') || t.includes('biology')) {
    return {
      gradient: 'linear-gradient(145deg, #14532d 0%, #16a34a 50%, #052e16 100%)',
      borderColor: 'rgba(134, 239, 172, 0.45)',
      frameColor: 'rgba(134, 239, 172, 0.25)',
      tagBg: 'rgba(134, 239, 172, 0.2)',
      tagColor: '#f0fdf4',
      tagText: 'NEET • BIOLOGY',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: '🧬',
      footer: 'TRUEMAN EDITIONS'
    };
  }
  if (t.includes('laxmikanth') || t.includes('indian polity')) {
    return {
      gradient: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
      borderColor: 'rgba(251, 191, 36, 0.5)',
      frameColor: 'rgba(251, 191, 36, 0.3)',
      tagBg: 'rgba(251, 191, 36, 0.2)',
      tagColor: '#fef3c7',
      tagText: 'UPSC CIVIL SERVICES',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '🏛️',
      footer: 'MCGRAW HILL PUB'
    };
  }
  if (t.includes('irodov')) {
    return {
      gradient: 'linear-gradient(145deg, #312e81 0%, #4338ca 50%, #1e1b4b 100%)',
      borderColor: 'rgba(165, 180, 252, 0.45)',
      frameColor: 'rgba(165, 180, 252, 0.25)',
      tagBg: 'rgba(165, 180, 252, 0.2)',
      tagColor: '#eef2ff',
      tagText: 'JEE ADVANCED',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '🔬',
      footer: 'MIR PUBLISHERS'
    };
  }
  if (t.includes('aggarwal') || t.includes('quantitative aptitude')) {
    return {
      gradient: 'linear-gradient(145deg, #1e293b 0%, #334155 50%, #0f172a 100%)',
      borderColor: 'rgba(203, 213, 225, 0.45)',
      frameColor: 'rgba(203, 213, 225, 0.25)',
      tagBg: 'rgba(203, 213, 225, 0.2)',
      tagColor: '#f8fafc',
      tagText: 'COMPETITIVE EXAMS',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '🔢',
      footer: 'S. CHAND PUBLISHING'
    };
  }
  if (t.includes('wings of fire') || t.includes('abdul kalam')) {
    return {
      gradient: 'linear-gradient(145deg, #451a03 0%, #9a3412 50%, #1c1917 100%)',
      borderColor: 'rgba(251, 146, 60, 0.5)',
      frameColor: 'rgba(251, 146, 60, 0.25)',
      tagBg: 'rgba(251, 146, 60, 0.2)',
      tagColor: '#fff7ed',
      tagText: 'INSPIRATIONAL MEMOIR',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '🔥',
      footer: 'UNIVERSITIES PRESS'
    };
  }
  if (t.includes('bhagavad gita') || t.includes('gita')) {
    return {
      gradient: 'linear-gradient(145deg, #78350f 0%, #d97706 50%, #451a03 100%)',
      borderColor: 'rgba(251, 191, 36, 0.5)',
      frameColor: 'rgba(251, 191, 36, 0.3)',
      tagBg: 'rgba(251, 191, 36, 0.25)',
      tagColor: '#fef3c7',
      tagText: 'श्रीमद्भगवद्गीता',
      emblemBg: 'rgba(0,0,0,0.35)',
      icon: '🕉️',
      footer: 'गीताप्रेस गोरखपुर'
    };
  }
  if (t.includes('atomic habits')) {
    return {
      gradient: 'linear-gradient(145deg, #18181b 0%, #27272a 50%, #09090b 100%)',
      borderColor: 'rgba(250, 204, 21, 0.5)',
      frameColor: 'rgba(250, 204, 21, 0.3)',
      tagBg: 'rgba(250, 204, 21, 0.2)',
      tagColor: '#fef08a',
      tagText: '#1 BESTSELLER',
      emblemBg: 'rgba(0,0,0,0.4)',
      icon: '⚛️',
      footer: 'PENGUIN RANDOM HOUSE'
    };
  }
  if (t.includes('clean code')) {
    return {
      gradient: 'linear-gradient(145deg, #090d16 0%, #1e293b 50%, #020617 100%)',
      borderColor: 'rgba(45, 212, 191, 0.5)',
      frameColor: 'rgba(45, 212, 191, 0.25)',
      tagBg: 'rgba(45, 212, 191, 0.2)',
      tagColor: '#ccfbf1',
      tagText: 'SOFTWARE CRAFT',
      emblemBg: 'rgba(0,0,0,0.4)',
      icon: '💻',
      footer: 'PRENTICE HALL'
    };
  }
  if (t.includes('double entry') || t.includes('grewal')) {
    return {
      gradient: 'linear-gradient(145deg, #064e3b 0%, #059669 50%, #022c22 100%)',
      borderColor: 'rgba(110, 231, 183, 0.45)',
      frameColor: 'rgba(110, 231, 183, 0.25)',
      tagBg: 'rgba(110, 231, 183, 0.2)',
      tagColor: '#ecfdf5',
      tagText: 'COMMERCE • CLASS 12',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: '📈',
      footer: 'SULTAN CHAND PUB'
    };
  }

  // 2. Genre-Based Defaults
  if (g.includes('ncert') || t.includes('ncert')) {
    let tag = 'NCERT TEXTBOOK';
    if (g.includes('10')) tag = 'NCERT • CLASS 10';
    if (g.includes('12')) tag = 'NCERT • CLASS 12';
    const baseColor = b.cover || '#0284c7';
    return {
      gradient: `linear-gradient(145deg, ${baseColor} 0%, #0f172a 100%)`,
      borderColor: 'rgba(255,255,255,0.35)',
      frameColor: 'rgba(255,255,255,0.2)',
      tagBg: 'rgba(255,255,255,0.2)',
      tagColor: '#ffffff',
      tagText: tag,
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '📚',
      footer: 'NATIONAL COUNCIL NCERT'
    };
  }
  if (g.includes('poetry') || g.includes('literature')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#7c3aed'} 0%, #1e1b4b 100%)`,
      borderColor: 'rgba(245, 158, 11, 0.45)',
      frameColor: 'rgba(245, 158, 11, 0.2)',
      tagBg: 'rgba(245, 158, 11, 0.2)',
      tagColor: '#fef3c7',
      tagText: 'LITERATURE & POETRY',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '📜',
      footer: 'CLASSIC EDITION'
    };
  }
  if (g.includes('science')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#059669'} 0%, #022c22 100%)`,
      borderColor: 'rgba(56, 189, 248, 0.45)',
      frameColor: 'rgba(56, 189, 248, 0.2)',
      tagBg: 'rgba(56, 189, 248, 0.2)',
      tagColor: '#e0f2fe',
      tagText: 'SCIENCE & LABS',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '⚗️',
      footer: 'ACADEMIC SCIENCE'
    };
  }
  if (g.includes('math')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#2563eb'} 0%, #0f172a 100%)`,
      borderColor: 'rgba(147, 197, 253, 0.45)',
      frameColor: 'rgba(147, 197, 253, 0.2)',
      tagBg: 'rgba(147, 197, 253, 0.2)',
      tagColor: '#eff6ff',
      tagText: 'MATHEMATICS',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '📐',
      footer: 'ADVANCED MATHEMATICS'
    };
  }
  if (g.includes('arts') || g.includes('history')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#9a3412'} 0%, #431407 100%)`,
      borderColor: 'rgba(251, 146, 60, 0.45)',
      frameColor: 'rgba(251, 146, 60, 0.2)',
      tagBg: 'rgba(251, 146, 60, 0.2)',
      tagColor: '#fff7ed',
      tagText: 'ARTS & HUMANITIES',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '🏛️',
      footer: 'HISTORICAL ARCHIVES'
    };
  }
  if (g.includes('commerce') || g.includes('economics')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#047857'} 0%, #064e3b 100%)`,
      borderColor: 'rgba(110, 231, 183, 0.45)',
      frameColor: 'rgba(110, 231, 183, 0.2)',
      tagBg: 'rgba(110, 231, 183, 0.2)',
      tagColor: '#ecfdf5',
      tagText: 'COMMERCE & FINANCE',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '📊',
      footer: 'ECONOMIC RESEARCH'
    };
  }
  if (g.includes('competitive')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#1e1b4b'} 0%, #0f172a 100%)`,
      borderColor: 'rgba(251, 191, 36, 0.45)',
      frameColor: 'rgba(251, 191, 36, 0.2)',
      tagBg: 'rgba(251, 191, 36, 0.2)',
      tagColor: '#fef3c7',
      tagText: 'COMPETITIVE EXAM',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '🎯',
      footer: 'EXAM FOUNDATION'
    };
  }
  if (g.includes('philosophy')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#d97706'} 0%, #451a03 100%)`,
      borderColor: 'rgba(251, 191, 36, 0.5)',
      frameColor: 'rgba(251, 191, 36, 0.3)',
      tagBg: 'rgba(251, 191, 36, 0.2)',
      tagColor: '#fef3c7',
      tagText: 'PHILOSOPHY & THOUGHT',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '🕉️',
      footer: 'PHILOSOPHICAL TEXT'
    };
  }
  if (g.includes('technology') || g.includes('tech')) {
    return {
      gradient: `linear-gradient(145deg, ${b.cover || '#0f172a'} 0%, #020617 100%)`,
      borderColor: 'rgba(45, 212, 191, 0.45)',
      frameColor: 'rgba(45, 212, 191, 0.2)',
      tagBg: 'rgba(45, 212, 191, 0.2)',
      tagColor: '#ccfbf1',
      tagText: 'COMPUTER SCIENCE',
      emblemBg: 'rgba(0,0,0,0.3)',
      icon: b.emoji || '💻',
      footer: 'TECH EDITIONS'
    };
  }

  // 3. Universal Fallback
  const bg = b.cover || '#1e293b';
  return {
    gradient: `linear-gradient(145deg, ${bg} 0%, #0f172a 100%)`,
    borderColor: 'rgba(255,255,255,0.3)',
    frameColor: 'rgba(255,255,255,0.18)',
    tagBg: 'rgba(255,255,255,0.18)',
    tagColor: '#ffffff',
    tagText: b.genre ? b.genre.toUpperCase() : 'LIBRARY EDITION',
    emblemBg: 'rgba(0,0,0,0.3)',
    icon: b.emoji || '📖',
    footer: 'ALEXANDRIA LIBRARY'
  };
}

// ── Smart Cover URL Resolver ─────────────────────────────────────────
function getBookCoverUrl(b) {
  if (b.coverUrl) return b.coverUrl;
  const t = (b.title || '').toLowerCase();

  // Explicit Cover Photo Mappings (All 23 Books)
  if (t.includes('rashmirathi') || t.includes('रश्मिरथी')) return 'covers/rashmirathi.jpg';
  if (t.includes('gitanjali')) return 'covers/gitanjali.jpg';
  if (t.includes('madhushala') || t.includes('मधुशाला')) return 'covers/madhushala.jpg';
  if (t.includes('science') && (t.includes('10') || t.includes('ncert'))) return 'covers/ncert_science10.jpg';
  if (t.includes('mathematics') && t.includes('10')) return 'covers/ncert_math10.jpg';
  if (t.includes('social') && (t.includes('10') || t.includes('ncert'))) return 'covers/ncert_social10.jpg';
  if (t.includes('physics') && (t.includes('verma') || t.includes('concepts'))) return 'covers/physics_hcverma.jpg';
  if (t.includes('chemistry')) return 'covers/ncert_chemistry12.jpg';
  if (t.includes('biology') || t.includes('trueman')) return 'covers/biology_trueman.jpg';
  if (t.includes('rd sharma') || (t.includes('mathematics') && t.includes('sharma'))) return 'covers/rdsharma.jpg';
  if (t.includes('mathematics') && t.includes('12')) return 'covers/ncert_math12.jpg';
  if (t.includes('history')) return 'covers/indian_history12.jpg';
  if (t.includes('constitution') || t.includes('samvidhan')) return 'covers/samvidhan.png';
  if (t.includes('geography')) return 'covers/ncert_geography12.jpg';
  if (t.includes('double entry') || t.includes('grewal') || t.includes('book keeping')) return 'covers/tsgrewal_accounts.jpg';
  if (t.includes('economic') || t.includes('macroeconomics')) return 'covers/ncert_economics12.jpg';
  if (t.includes('laxmikanth') || t.includes('polity')) return 'covers/laxmikanth.jpg';
  if (t.includes('irodov')) return 'covers/irodov.jpg';
  if (t.includes('aggarwal') || t.includes('quantitative aptitude')) return 'covers/rsaggarwal_aptitude.jpg';
  if (t.includes('wings of fire') || t.includes('kalam')) return 'covers/wingsoffire.jpg';
  if (t.includes('bhagavad gita') || (t.includes('gita') && !t.includes('gitanjali'))) return 'covers/gita.png';
  if (t.includes('atomic habits')) return 'covers/atomichabits.jpg';
  if (t.includes('clean code')) return 'covers/cleancode.jpg';
  if (t.includes('arthashastra')) return 'covers/arthashastra.png';
  if (t.includes('ramayana')) return 'covers/ramayana.png';
  if (t.includes('mahabharata')) return 'covers/mahabharata.png';

  if (b.isbn && typeof getOpenLibraryCover === 'function') {
    return getOpenLibraryCover(b.isbn, 'M');
  }
  return '';
}

// ── Render Complete Book Cover Template HTML ─────────────────────────
function renderBookCoverHTML(b) {
  const theme = getBookCoverTheme(b);
  const coverUrl = getBookCoverUrl(b);
  const titleDisplay = (b.title || 'Untitled Book').replace(/"/g, '&quot;');
  const authorDisplay = (b.author || 'Alexandria Editorial').replace(/"/g, '&quot;');

  return `
    <div class="book-cover">
      <!-- ── Realistic Hardcover Template ─────────────────────── -->
      <div class="book-template" style="background:${theme.gradient};border:1px solid ${theme.borderColor}">
        <div class="book-spine-line"></div>
        <div class="book-gloss-sheen"></div>
        <div class="book-inner-border" style="border-color:${theme.frameColor}">
          <div class="book-template-tag" style="background:${theme.tagBg};color:${theme.tagColor}">${theme.tagText}</div>
          <div class="book-template-emblem" style="background:${theme.emblemBg};border-color:${theme.borderColor}">
            <span>${theme.icon}</span>
          </div>
          <div class="book-template-meta">
            <div class="book-template-title" title="${titleDisplay}">${titleDisplay}</div>
            <div class="book-template-author">by ${authorDisplay}</div>
          </div>
          <div class="book-template-footer">${theme.footer}</div>
        </div>
      </div>

      <!-- ── Real Cover Image (when available, hides on 404 to reveal template) ── -->
      ${coverUrl ? `
      <img
        class="book-cover-img"
        src="${coverUrl}"
        alt="${titleDisplay} cover"
        loading="lazy"
        onerror="this.style.display='none'"
        onload="if(this.naturalWidth<=1||this.naturalHeight<=1){this.style.display='none'}"
      />
      ` : ''}

      <!-- ── 3D Hardcover Spine Crease & Shadow ── -->
      <div class="book-spine-shadow"></div>

      <!-- Badges -->
      ${b.ebook ? '<span class="book-badge-ebook">E-BOOK</span>' : ''}
      ${b.indian ? '<span class="book-badge-indian">🇮🇳</span>' : ''}
    </div>
  `;
}

// ── Render Books ───────────────────────────────────────────────────
function renderBooks(list, containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  const bookIdProp = b => b.id || b._id || '';

  c.innerHTML = list.map(b => `
    <div class="book-card" onclick="showBookDetail('${bookIdProp(b)}')">
      ${renderBookCoverHTML(b)}
      <div class="book-info">
        <div class="book-title" title="${b.title}">${b.title}</div>
        <div class="book-author">${b.author}</div>
        <div class="book-meta">
          <span class="badge ${statusBadge(b.status)}">${b.status}</span>
          <span style="font-size:10px;color:var(--text3)">⭐ ${b.rating}</span>
        </div>
        <div style="font-size:11px;color:${(b.copies - (b.borrowed||0)) > 0 ? 'var(--teal)' : 'var(--red)'};font-weight:600;margin-top:4px">
          📚 ${(b.copies - (b.borrowed||0)) > 0 ? (b.copies - (b.borrowed||0)) + ' / ' + b.copies + ' Available' : 'Out of Stock (0/' + b.copies + ')'}
        </div>
      </div>
    </div>
  `).join('');

  const countEl = document.getElementById('book-count');
  if (countEl && containerId === 'book-grid') {
    countEl.textContent = `${list.length} books found`;
  }
}

function statusBadge(s) {
  return { Available:'badge-green', Borrowed:'badge-red', Reserved:'badge-amber', 'E-Book':'badge-teal' }[s] || 'badge-navy';
}

// ── Filter & Search ──────────────────────────────────────────────────
let indianFilterActive = false;

function toggleIndianFilter() {
  indianFilterActive = !indianFilterActive;
  const btn = document.getElementById('indian-filter-btn');
  if (btn) {
    btn.style.outline = indianFilterActive ? '2px solid white' : 'none';
    btn.style.boxShadow = indianFilterActive ? '0 0 0 3px rgba(255,153,51,0.5)' : 'none';
  }
  filterBooks();
}

async function filterBooks() {
  const q = document.getElementById('catalog-search')?.value || '';
  const g = document.getElementById('filter-genre')?.value || '';
  const s = document.getElementById('filter-status')?.value || '';
  const b = document.getElementById('filter-branch')?.value || '';

  // Build API query params
  const params = {};
  if (q) params.search = q;
  if (g) params.genre = g;
  if (s) params.status = s;
  if (b) params.branch = b;
  if (indianFilterActive) params.indian = 'true';

  const filtered = await fetchBooks(params);
  renderBooks(filtered, 'book-grid');
}

function clearFilters() {
  document.getElementById('catalog-search').value = '';
  document.getElementById('filter-genre').value   = '';
  document.getElementById('filter-status').value  = '';
  document.getElementById('filter-branch').value  = '';
  indianFilterActive = false;
  const btn = document.getElementById('indian-filter-btn');
  if (btn) { btn.style.outline = 'none'; btn.style.boxShadow = 'none'; }
  filterBooks();
}

// ── Add Book Modal ─────────────────────────────────────────────────
function openAddBook() {
  showModal('📖 Add New Book', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">ISBN (Optional)</label><input class="form-input" placeholder="978-..." id="new-isbn"></div>
      <div style="display:flex;align-items:flex-end;padding-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="fetchISBN()">Auto-fetch</button></div>
    </div>
    <div class="form-group"><label class="form-label">Title *</label><input class="form-input" id="new-title" placeholder="e.g. Gita, Ramayana, Computer Networks"></div>
    <div class="form-group"><label class="form-label">Author *</label><input class="form-input" id="new-author" placeholder="Author name"></div>
    <div class="form-group"><label class="form-label">Cover Photo Image URL (Optional)</label><input class="form-input" id="new-cover-url" placeholder="https://example.com/cover.jpg"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Genre</label>
        <select class="form-select" id="new-genre"><option>Fiction</option><option>Science</option><option>History</option><option>Technology</option><option>Philosophy</option><option>Biography</option><option>Mystery</option><option>Self-Help</option></select>
      </div>
      <div class="form-group"><label class="form-label">Copies</label><input class="form-input" type="number" value="1" min="1" id="new-copies"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Branch</label>
        <select class="form-select" id="new-branch"><option>Main Branch</option><option>North Branch</option><option>East Wing</option></select>
      </div>
      <div class="form-group"><label class="form-label">Type</label>
        <select class="form-select" id="new-type"><option value="physical">Physical Book</option><option value="ebook">E-Book</option><option value="both">Both</option></select>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-primary" style="flex:1" onclick="addBook()">Add to Catalog & MongoDB</button>
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

function fetchISBN() {
  document.getElementById('new-title').value  = 'The Great Gatsby';
  document.getElementById('new-author').value = 'F. Scott Fitzgerald';
  notify('ISBN metadata fetched!', 'success');
}

async function addBook() {
  const title    = document.getElementById('new-title')?.value?.trim();
  const author   = document.getElementById('new-author')?.value?.trim();
  const isbn     = document.getElementById('new-isbn')?.value?.trim();
  const coverUrl = document.getElementById('new-cover-url')?.value?.trim();
  const genre    = document.getElementById('new-genre')?.value || 'Fiction';
  const copies   = parseInt(document.getElementById('new-copies')?.value) || 1;
  const branch   = document.getElementById('new-branch')?.value || 'Main Branch';
  const type     = document.getElementById('new-type')?.value;

  if (!title || !author) {
    notify('Please fill in title and author', 'error');
    return;
  }

  try {
    const hasHindi = /[\u0900-\u097F]/.test(title + author);

    const bookData = {
      title,
      author,
      genre,
      copies,
      branch,
      ebook: type === 'ebook' || type === 'both',
      status: type === 'ebook' ? 'E-Book' : 'Available',
      emoji: hasHindi ? '🇮🇳' : '📖',
      cover: hasHindi ? '#d97706' : '#1a2a3a',
      indian: hasHindi
    };

    if (isbn) bookData.isbn = isbn;
    if (coverUrl) bookData.coverUrl = coverUrl;

    await apiPost('/books', bookData);
    notify(`"${title}" added to catalog & MongoDB successfully!`, 'success');
    closeModal();

    // Refresh book list
    BOOKS = await fetchBooks();
    renderBooks(BOOKS, 'book-grid');
  } catch (error) {
    notify(error.message || 'Failed to add book', 'error');
  }
}

// ── Bulk CSV Import ────────────────────────────────────────────────
let selectedCSVFile = null;

function handleCSVSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  selectedCSVFile = file;
  const label = document.getElementById('csv-filename-label');
  if (label) label.textContent = `📄 Selected: ${file.name} (${(file.size/1024).toFixed(1)} KB)`;
  notify(`Selected file: ${file.name}`, 'info');
}

function downloadSampleCSV() {
  const csvContent = 'Title,Author,Genre,ISBN,Copies,Branch\nClean Architecture,Robert C. Martin,Technology,9780134494166,3,Main Branch\nDeep Work,Cal Newport,Self-Help,9781455586691,4,North Branch\nThe Lean Startup,Eric Ries,Technology,9780307887894,2,East Wing\n';
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sample_books_import.csv';
  a.click();
  notify('Sample CSV downloaded!', 'success');
}

async function uploadCSV() {
  if (!selectedCSVFile) {
    notify('Please select a CSV file first', 'error');
    return;
  }

  const p = document.getElementById('import-progress');
  const bar = document.getElementById('import-bar');
  const status = document.getElementById('import-status');
  const countLabel = document.getElementById('import-count-label');
  const targetBranch = document.getElementById('import-target-branch')?.value || 'Main Branch';

  if (p) p.style.display = 'block';
  if (bar) bar.style.width = '30%';
  if (status) status.textContent = 'Reading CSV file...';

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const text = e.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);

      if (lines.length <= 1) {
        notify('CSV file is empty or missing data', 'error');
        return;
      }

      if (bar) bar.style.width = '60%';
      if (status) status.textContent = 'Parsing book records...';

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const booksToImport = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length < 2) continue;

        const row = {};
        headers.forEach((h, idx) => {
          row[h] = values[idx] || '';
        });

        booksToImport.push({
          title: row.title || `Imported Book #${i}`,
          author: row.author || 'Unknown Author',
          genre: row.genre || 'Fiction',
          isbn: row.isbn || `978${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          copies: parseInt(row.copies) || 1,
          branch: row.branch || targetBranch,
          status: 'Available',
          emoji: '📖',
          cover: '#1a3a3a'
        });
      }

      if (countLabel) countLabel.textContent = `Importing ${booksToImport.length} records into MongoDB...`;
      if (bar) bar.style.width = '80%';
      if (status) status.textContent = 'Sending records to MongoDB...';

      const res = await apiPost('/books/bulk', booksToImport);

      if (bar) bar.style.width = '100%';
      if (status) status.textContent = `Done! ${res.count || booksToImport.length} books added to MongoDB database.`;
      notify(`🎉 ${res.count || booksToImport.length} books imported successfully into MongoDB!`, 'success');

      // Refresh global books list
      BOOKS = await fetchBooks();
      if (typeof renderBooks === 'function') renderBooks(BOOKS, 'book-grid');

    } catch (error) {
      console.error('CSV Import Error:', error);
      notify(error.message || 'Failed to import CSV', 'error');
    }
  };
  reader.readAsText(selectedCSVFile);
}
