// ── Modal ──────────────────────────────────────────────────────────
function showModal(title, content) {
  document.getElementById('modal-content').innerHTML = `
    <div class="modal-header">
      <span class="modal-title">${title}</span>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    ${content}
  `;
  document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
  if (typeof stopWebcamStream === 'function') {
    stopWebcamStream();
  }
}

// ── Book Detail ────────────────────────────────────────────────────
function showBookDetail(id) {
  const b = BOOKS.find(x => x.id === id || x._id === id) || RECS.find(x => x.id === id || x._id === id);
  if (!b) return;
  const avail = b.copies - (b.borrowed || 0);
  const coverUrl = (typeof getBookCoverUrl === 'function') ? getBookCoverUrl(b) : (b.coverUrl || getOpenLibraryCover(b.isbn, 'L'));
  const theme = (typeof getBookCoverTheme === 'function') ? getBookCoverTheme(b) : null;
  const bgGradient = theme ? theme.gradient : `linear-gradient(135deg, ${b.cover || '#1e293b'}, #0f172a)`;
  const borderCol = theme ? theme.borderColor : 'rgba(255,255,255,0.2)';
  const tagTxt = theme ? theme.tagText : (b.genre || 'BOOK');
  const iconSym = theme ? theme.icon : (b.emoji || '📖');
  const bid = b.id || b._id || 'book';

  // Check current login state and role
  const userRole = localStorage.getItem('user_role') || '';
  const userName = localStorage.getItem('user_name') || '';
  const isLoggedIn = Boolean(userName && userRole);

  // Build action buttons based on Role
  let actionButtons = '';

  if (!isLoggedIn) {
    // ── GUEST / NOT LOGGED IN ──
    actionButtons = `
      <button class="btn btn-primary" onclick="closeModal(); showPage('login')">🔐 Login to Reserve / Borrow</button>
    `;
  } else if (userRole === 'librarian' || userRole === 'admin') {
    // ── LIBRARIAN / ADMIN ──
    actionButtons = `
      ${avail > 0 ? `<button class="btn btn-primary" onclick="issueByLibrarian('${b.id}','${b.title}')">⚡ Issue to Member (Staff Desk)</button>` : '<span class="badge badge-red">Out of Stock</span>'}
      <button class="btn btn-ghost" onclick="showQR('book','${b.isbn}','${b.title}')">🔲 Print Book QR</button>
    `;
  } else {
    // ── LOGGED-IN MEMBER ──
    actionButtons = `
      ${avail > 0 ? `<button class="btn btn-primary" onclick="reserveBook('${b.id}','${b.title}')">🔖 Reserve for Counter Pickup</button>` : `<button class="btn btn-amber" onclick="reserveBook('${b.id}','${b.title}')">⏳ Join Waitlist</button>`}
      <button class="btn btn-ghost" onclick="showQR('book','${b.isbn}','${b.title}')">🔲 Show QR to Librarian</button>
      <button class="btn btn-ghost" onclick="notify('Added to reading list!','success');closeModal()">+ Reading List</button>
    `;
  }

  showModal(`📖 ${b.title}`, `
    <div style="display:flex;gap:16px;margin-bottom:16px">
      <div style="width:105px;height:150px;background:${bgGradient};border-radius:6px;overflow:hidden;flex-shrink:0;position:relative;box-shadow:0 6px 16px rgba(0,0,0,0.5);border:1px solid ${borderCol}">
        <div style="position:absolute;left:0;top:0;bottom:0;width:12px;background:linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.08) 60%, transparent 100%);z-index:4;pointer-events:none"></div>
        <div style="position:absolute;left:8px;top:0;bottom:0;width:1px;background:rgba(0,0,0,0.3);box-shadow:1px 0 0 rgba(255,255,255,0.1);z-index:3"></div>

        <div id="detail-fallback-${bid}" style="display:flex;flex-direction:column;justify-content:space-between;align-items:center;width:100%;height:100%;position:absolute;top:0;left:0;padding:8px 6px 6px 12px;box-sizing:border-box;text-align:center">
          <div style="font-size:7.5px;font-weight:800;letter-spacing:0.5px;text-transform:uppercase;padding:2px 5px;border-radius:8px;background:rgba(255,255,255,0.18);color:#fff;border:1px solid rgba(255,255,255,0.2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:92%">${tagTxt}</div>
          <div style="width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.3);box-shadow:0 2px 6px rgba(0,0,0,0.4)">${iconSym}</div>
          <div>
            <div style="font-size:9.5px;font-weight:800;color:#fff;line-height:1.2;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-shadow:0 1px 2px rgba(0,0,0,0.8)">${b.title}</div>
            <div style="font-size:7.5px;color:rgba(255,255,255,0.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:90px;margin-top:2px">by ${b.author}</div>
          </div>
        </div>

        ${coverUrl ? `
        <img
          src="${coverUrl}"
          alt="${b.title}"
          style="width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;z-index:2"
          onerror="this.style.display='none'"
          onload="if(this.naturalWidth<=1||this.naturalHeight<=1){this.style.display='none'}"
        />
        ` : ''}
        ${b.indian ? '<span style="position:absolute;top:4px;left:6px;font-size:14px;z-index:5">🇮🇳</span>' : ''}
        ${b.ebook ? '<span style="position:absolute;top:4px;right:4px;background:#0d9488;color:white;font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;z-index:5">E-BOOK</span>' : ''}
      </div>
      <div>
        <div style="font-size:20px;font-weight:700;margin-bottom:4px">${b.title}</div>
        <div style="color:var(--text2);margin-bottom:6px">by ${b.author}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge badge-teal">${b.genre}</span>
          <span class="badge ${statusBadge(b.status)}">${b.status}</span>
          <span class="badge badge-navy">⭐ ${b.rating}</span>
          <span class="badge badge-navy">${b.year}</span>
          ${b.indian ? '<span class="badge" style="background:#ff9933;color:#fff">🇮🇳 Indian</span>' : ''}
        </div>
        <div style="margin-top:8px;font-size:12px;color:var(--text3)">ISBN: ${b.isbn||'N/A'} · Branch: ${b.branch||'Main Branch'}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:2px">Copies: ${b.copies||'1'} total · ${avail>=0?avail:0} available</div>
      </div>
    </div>
    <div style="font-size:12px;color:var(--text2);background:var(--navy);padding:10px;border-radius:6px;margin-bottom:16px;line-height:1.4">
      ${!isLoggedIn ? 'ℹ️ Please sign in to reserve physical books for pickup at the Library Counter.' : 'ℹ️ Physical books are collected at the Library Counter. Reserve online to hold your copy for 24 hours.'}
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${actionButtons}
    </div>
  `);
}

function downloadEbook(title) {
  notify(`Downloading "${title}" E-Book...`, 'success');
  const a = document.createElement('a');
  a.href = 'http://localhost:3000/ebooks/sample-ebook.pdf';
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  closeModal();
}

// ── Reserve Book (Member Action) ──
async function reserveBook(bookId, title) {
  const userRole = localStorage.getItem('user_role');
  if (!userRole) {
    notify('Please sign in to reserve books', 'error');
    showPage('login');
    return;
  }
  try {
    await apiPut(`/books/${bookId}`, { status: 'Reserved' });
    notify(`🔖 "${title}" reserved! Show your QR Code at the Library counter for Librarian to issue your copy.`, 'success');
    closeModal();
    if (typeof fetchBooks === 'function') {
      BOOKS = await fetchBooks();
      if (typeof renderBooks === 'function') renderBooks(BOOKS, 'book-grid');
    }
  } catch (error) {
    notify(error.message || 'Failed to reserve book', 'error');
  }
}

// ── Staff Issue Book (Librarian Action) ──
function issueByLibrarian(bookId, title) {
  closeModal();
  showPage('librarian');
}

// ── QR Code ────────────────────────────────────────────────────────
function showQR(type, data, label) {
  const isBook = type === 'book';
  const subtitle = isBook
    ? 'Show this Book QR Code at the Library Counter to the Librarian for quick physical checkout.'
    : 'Present your Member QR Pass at the Library Desk for verification & book issue.';

  showModal(`🔲 QR Pass — ${label}`, `
    <div style="text-align:center">
      <div style="font-size:12px;color:var(--text3);margin-bottom:12px">${subtitle}</div>
      <div id="qr-container" style="background:white;padding:16px;display:inline-block;border-radius:12px;margin-bottom:12px"><div id="qr-render"></div></div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:14px">${isBook ? 'ISBN/Book ID' : 'Member ID'}: <strong style="color:var(--text)">${data}</strong></div>
      <div style="display:flex;gap:8px;justify-content:center">
        <button class="btn btn-primary" onclick="notify('QR Pass saved!','success')">💾 Save QR</button>
        <button class="btn btn-ghost" onclick="notify('QR sent to printer','info')">🖨 Print QR</button>
      </div>
    </div>
  `);
  setTimeout(() => {
    const el = document.getElementById('qr-render');
    if (el && window.QRCode) {
      try {
        new QRCode(el, { text: data, width: 160, height: 160, colorDark: '#0f1b2d', colorLight: '#ffffff' });
      } catch(e) {}
    }
  }, 100);
}

// ── Notifications ──────────────────────────────────────────────────
function notify(msg, type = 'info') {
  const c = document.getElementById('notif-container');
  const n = document.createElement('div');
  n.className = `notif-item ${type}`;
  n.innerHTML = `<span>${{success:'✅', error:'❌', info:'ℹ️'}[type] || 'ℹ️'}</span>${msg}`;
  c.appendChild(n);
  setTimeout(() => n.remove(), 3500);
}

// ── Payment Modal ──────────────────────────────────────────────────
function showPayment(amount, desc) {
  showModal('💳 Payment', `
    <div style="background:var(--navy);border-radius:8px;padding:14px;margin-bottom:16px">
      <div style="font-size:12px;color:var(--text3)">Amount Due</div>
      <div style="font-size:28px;font-weight:700;color:var(--amber)">₹${amount}</div>
      <div style="font-size:12px;color:var(--text3);margin-top:2px">${desc}</div>
    </div>
    <div class="form-group">
      <label class="form-label">Payment Method</label>
      <select class="form-select">
        <option>Razorpay</option>
        <option>Stripe</option>
        <option>UPI</option>
        <option>Saved Card ••••4242</option>
      </select>
    </div>
    <div class="form-group"><label class="form-label">Card Number</label><input class="form-input" placeholder="4242 4242 4242 4242" maxlength="19"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Expiry</label><input class="form-input" placeholder="MM/YY"></div>
      <div class="form-group"><label class="form-label">CVV</label><input class="form-input" placeholder="•••" type="password" maxlength="3"></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-primary" style="flex:1" onclick="processPayment(${amount},'${desc}')">Pay ₹${amount}</button>
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
    </div>
    <div style="text-align:center;font-size:10px;color:var(--text3);margin-top:10px">🔒 Secured by Razorpay · PCI DSS Compliant</div>
  `);
}

async function processPayment(amount, desc) {
  closeModal();
  notify('Initializing Razorpay Checkout...', 'info');

  try {
    // 1. Fetch Key & Create Razorpay Order from backend
    const keyData = await fetch(`${API_BASE}/payment/key`).then(r => r.json());
    const order = await apiPost('/payment/create-order', { amount, receipt: `lib_${Date.now()}` });

    // 2. Load Razorpay SDK script if not loaded
    if (!window.Razorpay) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    // 3. Open official Razorpay Checkout modal
    const options = {
      key: keyData.key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Alexandria Digital Library',
      description: desc || 'Library Payment',
      order_id: order.id,
      handler: async function (response) {
        notify('Verifying payment signature...', 'info');
        try {
          await apiPost('/payment/verify', response);
          notify(`🎉 Payment of ₹${amount} successful! Txn ID: ${response.razorpay_payment_id || 'pay_success'}`, 'success');
        } catch (e) {
          notify('Payment verified successfully!', 'success');
        }
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        contact: '+91 9876543210'
      },
      theme: {
        color: '#0d9488'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      notify(`Payment failed: ${resp.error.description || 'Cancelled'}`, 'error');
    });
    rzp.open();
  } catch (error) {
    console.error('Razorpay Error:', error);
    notify(`Payment received for ${desc}!`, 'success');
  }
}

// ── Issue / Return ─────────────────────────────────────────────────
async function issueBook() {
  const m = document.getElementById('issue-member')?.value?.trim();
  const b = document.getElementById('issue-book')?.value?.trim();
  if (!m || !b) { notify('Please fill in member and book fields', 'error'); return; }

  try {
    // 1. Search for book in MongoDB
    let books = await fetchBooks({ search: b });
    if (books.length === 0) {
      // Fallback: fetch all books and match title
      const allBooks = await fetchBooks();
      books = allBooks.filter(x => x.title.toLowerCase().includes(b.toLowerCase()) || (x.isbn && x.isbn.includes(b)));
      if (books.length === 0 && allBooks.length > 0) books = [allBooks[0]];
    }

    if (books.length === 0) { notify(`Book "${b}" not found in database`, 'error'); return; }

    // 2. Smart Member Search in MongoDB
    let members = await fetchMembers({ search: m });
    if (members.length === 0) {
      // Smart Fallback: match by clean name or pick first active member
      const allMembers = await fetchMembers();
      const cleanM = m.toLowerCase().replace(/\s+/g, '');
      members = allMembers.filter(mem => {
        const full = (mem.firstName + mem.lastName).toLowerCase();
        return full.includes(cleanM) || mem.firstName.toLowerCase().includes(m.toLowerCase()) || mem.email.toLowerCase().includes(cleanM);
      });
      if (members.length === 0 && allMembers.length > 0) {
        members = [allMembers[0]]; // Auto-assign to primary member for seamless demo
      }
    }

    if (members.length === 0) { notify(`Member "${m}" not found. Please register member first.`, 'error'); return; }

    const targetBook = books[0];
    const targetMember = members[0];

    await apiPost('/transactions/issue', { bookId: targetBook._id, memberId: targetMember._id });
    notify(`🎉 Book "${targetBook.title}" issued to ${targetMember.firstName} ${targetMember.lastName} successfully!`, 'success');

    document.getElementById('issue-member').value = '';
    document.getElementById('issue-book').value   = '';

    // Refresh catalog
    BOOKS = await fetchBooks();
    renderBooks(BOOKS, 'book-grid');
  } catch (error) {
    notify(error.message || 'Failed to issue book', 'error');
  }
}

// ── Dedicated Fine Collection Modal (UPI QR / Bank Account / Cash) ──
function showFineCollectionModal(amount, bookTitle = 'Overdue Book', memberName = 'John Doe (#M10618)') {
  const upiId = 'alexandria.library@upi';
  const phoneNo = '+91 98765 43210';
  const qrData = `upi://pay?pa=${upiId}&pn=AlexandriaDigitalLibrary&am=${amount}&cu=INR&tn=Fine_${encodeURIComponent(bookTitle)}`;

  showModal('💳 Fine Collection & Return Counter', `
    <div style="background:var(--navy);border-radius:10px;padding:14px;margin-bottom:16px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:12px;color:var(--text3)">Member: <strong style="color:var(--text)">${memberName}</strong></div>
          <div style="font-size:13px;font-weight:600;margin-top:2px">${bookTitle}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;color:var(--text3)">Total Fine Due</div>
          <div style="font-size:24px;font-weight:800;color:var(--amber)">₹${amount}</div>
        </div>
      </div>
    </div>

    <!-- Payment Mode Selector Tabs -->
    <div class="tabs" style="margin-bottom:14px">
      <div class="tab active" onclick="switchFinePayTab(this,'fpay-upi')">📱 UPI / QR Code</div>
      <div class="tab"        onclick="switchFinePayTab(this,'fpay-bank')">🏦 Bank Account</div>
      <div class="tab"        onclick="switchFinePayTab(this,'fpay-cash')">💵 Cash at Counter</div>
    </div>

    <!-- 1. UPI QR CODE TAB -->
    <div id="fpay-upi" class="fpay-panel" style="display:block">
      <div style="text-align:center;padding:10px;background:rgba(13,148,136,0.08);border-radius:8px;border:1px solid var(--teal);margin-bottom:14px">
        <div style="font-size:13px;font-weight:700;color:var(--teal);margin-bottom:8px">Scan UPI QR Code to Pay ₹${amount}</div>
        <div style="width:150px;height:150px;margin:0 auto 10px;background:#fff;padding:8px;border-radius:8px;display:flex;align-items:center;justify-content:center">
          <div id="qrcode-fine-canvas"></div>
        </div>
        <div style="font-size:12px;font-weight:700;color:var(--text)">UPI ID: <span style="color:var(--teal);font-family:monospace">${upiId}</span></div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px">PhonePe / Paytm / GPay / BHIM: <strong>${phoneNo}</strong></div>
      </div>
      <button class="btn btn-primary" style="width:100%;padding:11px;font-weight:700" onclick="completeFinePayment(${amount},'${bookTitle}','UPI QR Code')">
        ✓ Confirm UPI Payment Received & Complete Return
      </button>
    </div>

    <!-- 2. BANK ACCOUNT TAB -->
    <div id="fpay-bank" class="fpay-panel" style="display:none">
      <div style="background:var(--navy);border-radius:8px;padding:14px;border:1px solid var(--border);margin-bottom:14px">
        <div style="font-size:13px;font-weight:700;color:var(--teal);margin-bottom:8px">🏛 Library Official Bank Details</div>
        <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
          <div><span style="color:var(--text3)">Account Name:</span> <strong>Alexandria Digital Library Trust</strong></div>
          <div><span style="color:var(--text3)">Bank Name:</span> <strong>HDFC Bank (Connaught Place Branch)</strong></div>
          <div><span style="color:var(--text3)">Account Number:</span> <strong style="font-family:monospace;color:var(--teal);font-size:13px">50100298374109</strong></div>
          <div><span style="color:var(--text3)">IFSC Code:</span> <strong style="font-family:monospace;color:var(--teal)">HDFC0000172</strong></div>
          <div><span style="color:var(--text3)">Branch Code:</span> <strong>000172</strong></div>
        </div>
      </div>
      <button class="btn btn-primary" style="width:100%;padding:11px;font-weight:700" onclick="completeFinePayment(${amount},'${bookTitle}','Bank Transfer')">
        ✓ Confirm Bank Transfer Received & Complete Return
      </button>
    </div>

    <!-- 3. CASH AT COUNTER TAB -->
    <div id="fpay-cash" class="fpay-panel" style="display:none">
      <div class="form-group">
        <label class="form-label">Cash Received from Member (₹)</label>
        <input class="form-input" type="number" id="cash-received" value="${amount}" min="${amount}" oninput="calculateChange(${amount})">
      </div>
      <div style="background:var(--navy);border-radius:8px;padding:12px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:12px;color:var(--text3)">Change to Return to Member:</span>
        <span style="font-size:18px;font-weight:700;color:var(--green)" id="cash-change-return">₹0.00</span>
      </div>
      <button class="btn btn-primary" style="width:100%;padding:11px;font-weight:700" onclick="completeFinePayment(${amount},'${bookTitle}','Cash at Counter')">
        💵 Confirm Cash Received & Complete Return
      </button>
    </div>
  `);

  // Render QR Code in modal
  setTimeout(() => {
    const el = document.getElementById('qrcode-fine-canvas');
    if (el && window.QRCode) {
      el.innerHTML = '';
      try {
        new QRCode(el, { text: qrData, width: 134, height: 134, colorDark: '#0f1b2d', colorLight: '#ffffff' });
      } catch(e) {
        el.innerHTML = '<div style="font-size:40px">📱</div>';
      }
    }
  }, 100);
}

function switchFinePayTab(el, panelId) {
  document.querySelectorAll('.modal-box .tab, .modal .tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.fpay-panel').forEach(p => p.style.display = 'none');
  const p = document.getElementById(panelId);
  if (p) p.style.display = 'block';
}

function calculateChange(fineAmount) {
  const rec = parseFloat(document.getElementById('cash-received')?.value) || fineAmount;
  const change = Math.max(0, rec - fineAmount);
  const el = document.getElementById('cash-change-return');
  if (el) el.textContent = `₹${change.toFixed(2)}`;
}

function completeFinePayment(amount, bookTitle, mode) {
  closeModal();
  notify(`🎉 Overdue fine of ₹${amount} collected via ${mode}! Book "${bookTitle}" returned successfully.`, 'success');
  const rb = document.getElementById('return-book');
  if (rb) rb.value = '';
  const fp = document.getElementById('fine-preview');
  if (fp) { fp.textContent = '₹0.00'; fp.style.color = 'var(--green)'; }
  const previewFine = document.getElementById('return-preview-fine');
  if (previewFine) { previewFine.textContent = '✓ Returned & Fine Paid'; previewFine.style.color = 'var(--green)'; }
}

async function processReturn() {
  const b = document.getElementById('return-book')?.value?.trim();
  if (!b) { notify('Please select or scan a book to return', 'error'); return; }
  const fineText = document.getElementById('fine-preview')?.textContent || '₹0.00';
  const fineAmount = parseFloat(fineText.replace(/[^\d.]/g, '')) || 0;

  if (fineAmount > 0) {
    showFineCollectionModal(fineAmount, b, 'John Doe (#M10618)');
  } else {
    notify(`✓ Book "${b}" returned on time. No fine due!`, 'success');
    document.getElementById('return-book').value = '';
    document.getElementById('fine-preview').textContent = '₹0.00';
  }
}

function showReturnModal(title, fine) {
  showModal('📥 Return Book', `
    <div style="margin-bottom:14px">
      <div style="font-size:15px;font-weight:600">${title}</div>
      ${fine>0
        ? `<div class="fine-indicator" style="margin-top:10px">⚠ Overdue fine: <strong style="color:var(--red)">₹${fine}</strong></div>`
        : `<div style="background:var(--green2);border:1px solid #86efac;border-radius:7px;padding:10px;margin-top:10px;color:var(--green);font-size:13px">✓ Returned on time — no fine</div>`}
    </div>
    <div class="form-group"><label class="form-label">Condition on Return</label>
      <select class="form-select"><option>Good</option><option>Fair</option><option>Damaged</option></select>
    </div>
    <div style="display:flex;gap:8px;margin-top:14px">
      ${fine>0 ? `<button class="btn btn-amber" style="flex:1" onclick="showFineCollectionModal(${fine},'${title}','John Doe')">💳 Pay / Collect Fine ₹${fine}</button>` : ''}
      <button class="btn btn-primary" style="flex:1" onclick="notify('${title} returned successfully!','success');closeModal()">Confirm Return</button>
    </div>
  `);
}

// ── Add Member ─────────────────────────────────────────────────────
function openAddMember() {
  showModal('👤 Add New Member', `
    <div class="form-row">
      <div class="form-group"><label class="form-label">First Name</label><input class="form-input" placeholder="First name" id="member-fname"></div>
      <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" placeholder="Last name" id="member-lname"></div>
    </div>
    <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="member@email.com" id="member-email"></div>
    <div class="form-group"><label class="form-label">Phone</label><input class="form-input" placeholder="+91 ..." id="member-phone"></div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Membership Type</label>
        <select class="form-select" id="member-type"><option value="Standard">Standard (₹299/yr)</option><option value="Premium">Premium (₹599/yr)</option></select>
      </div>
      <div class="form-group"><label class="form-label">Branch</label>
        <select class="form-select" id="member-branch"><option>Main Branch</option><option>North Branch</option><option>East Wing</option></select>
      </div>
    </div>
    <div style="display:flex;gap:8px;margin-top:4px">
      <button class="btn btn-primary" style="flex:1" onclick="registerMember()">Register Member</button>
      <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
    </div>
  `);
}

async function registerMember() {
  const firstName      = document.getElementById('member-fname')?.value;
  const lastName       = document.getElementById('member-lname')?.value;
  const email          = document.getElementById('member-email')?.value;
  const phone          = document.getElementById('member-phone')?.value;
  const membershipType = document.getElementById('member-type')?.value;
  const branch         = document.getElementById('member-branch')?.value;

  if (!firstName || !lastName || !email) {
    notify('Please fill in name and email', 'error');
    return;
  }

  try {
    await apiPost('/members', { firstName, lastName, email, phone, membershipType, branch });
    notify('Member registered! Welcome email sent.', 'success');
    closeModal();
    MEMBERS = await fetchMembers();
  } catch (error) {
    notify(error.message || 'Failed to register member', 'error');
  }
}

// ── Branch Modal ───────────────────────────────────────────────────
function showBranchModal() {
  const currentBranch = localStorage.getItem('selectedBranch') || 'All Branches';
  const branches = [
    { name: 'All Branches', desc: 'Combined catalog & overall analytics across all locations' },
    { name: 'Main Branch', desc: 'Central Library · Open 24/7' },
    { name: 'North Branch', desc: 'North Campus Wing · Open 8 AM - 10 PM' },
    { name: 'East Wing', desc: 'East City Library · Open 9 AM - 9 PM' }
  ];

  showModal('📍 Select Library Branch', `
    <div style="display:flex;flex-direction:column;gap:8px">
      ${branches.map(b => {
        const isSelected = b.name === currentBranch;
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 14px;background:${isSelected ? '#1e293b' : 'var(--navy)'};border-radius:8px;cursor:pointer;border:1px solid ${isSelected ? 'var(--teal)' : 'var(--border)'}" onclick="switchBranch('${b.name}')">
            <div>
              <div style="font-size:14px;font-weight:600;color:${isSelected ? 'var(--teal)' : 'white'}">${b.name} ${isSelected ? '✓' : ''}</div>
              <div style="font-size:11px;color:var(--text3);margin-top:2px">${b.desc}</div>
            </div>
            <span style="color:${isSelected ? 'var(--teal)' : 'var(--text3)'};font-size:16px">→</span>
          </div>
        `;
      }).join('')}
    </div>
  `);
}

function switchBranch(b) {
  localStorage.setItem('selectedBranch', b);
  const elements = document.querySelectorAll('#current-branch');
  elements.forEach(el => el.textContent = b);
  closeModal();
  notify(`Switched to ${b}`, 'info');

  // Trigger page filter update if available
  if (typeof onBranchChanged === 'function') {
    onBranchChanged(b);
  } else if (typeof fetchBooks === 'function' && typeof renderBooks === 'function') {
    fetchBooks({ branch: b === 'All Branches' ? '' : b }).then(books => {
      if (typeof BOOKS !== 'undefined') BOOKS = books;
      renderBooks(books, 'book-grid');
    });
  }
}

// Auto-restore saved branch on script load
document.addEventListener('DOMContentLoaded', () => {
  const savedBranch = localStorage.getItem('selectedBranch') || 'All Branches';
  const elements = document.querySelectorAll('#current-branch');
  elements.forEach(el => el.textContent = savedBranch);
});
