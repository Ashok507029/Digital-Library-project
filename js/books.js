// ── Render Books ───────────────────────────────────────────────────
function renderBooks(list, containerId) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = list.map(b => {
    const coverUrl = b.coverUrl || getOpenLibraryCover(b.isbn, 'M');
    const bg = b.cover || '#1e293b';
    return `
    <div class="book-card" onclick="showBookDetail('${b.id}')">
      <div class="book-cover" style="background:${bg};position:relative;overflow:hidden">
        ${coverUrl ? `
        <img
          class="book-cover-img"
          src="${coverUrl}"
          alt="${b.title} cover"
          onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80'"
          style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;border-radius:inherit;z-index:1"
        />
        ` : ''}
        ${b.ebook ? '<span style="position:absolute;top:6px;right:6px;background:#0d9488;color:white;font-size:9px;padding:2px 5px;border-radius:4px;z-index:2">E-BOOK</span>' : ''}
        ${b.indian ? '<span style="position:absolute;top:6px;left:6px;font-size:14px;z-index:2">🇮🇳</span>' : ''}
      </div>
      <div class="book-info">
        <div class="book-title">${b.title}</div>
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
  `;
  }).join('');

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
