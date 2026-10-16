/* ==========================================================================
   CAMPUSTOOLS - ACADEMIC SUITE LOGIC
   Handcrafted & Developed by Vikas (B.Tech CSE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Pills Logic
  initNavigation();

  // CGPA & Target Predictor Logic
  initSgpaCalculator();
  initTargetCgpaPredictor();

  // Percentage & Marks Logic
  initPercentageCalculator();

  // Attendance & Bunk Advisor Logic
  initAttendanceCalculator();

  // Copy Summary Handler
  initCopySummary();

  // Load History
  loadHistoryLog();
});

/* -------------------------------------------------------------------------- */
/* 1. NAVIGATION PILLS                                                        */
/* -------------------------------------------------------------------------- */
function initNavigation() {
  const pills = document.querySelectorAll('.pill-btn');
  const tabs = document.querySelectorAll('.tab-content');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetId = pill.dataset.tab;

      pills.forEach(p => p.classList.remove('active'));
      tabs.forEach(t => t.classList.remove('active'));

      pill.classList.add('active');
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 2. SGPA CALCULATOR WITH REALISTIC ENGINEERING COURSES                       */
/* -------------------------------------------------------------------------- */
function initSgpaCalculator() {
  const tableBody = document.getElementById('subject-rows');
  const addBtn = document.getElementById('add-subject-btn');
  const calcBtn = document.getElementById('calc-sgpa-btn');
  const resetBtn = document.getElementById('reset-sgpa-btn');

  const gradeValues = {
    'O': 10,
    'A+': 9,
    'A': 8,
    'B+': 7,
    'B': 6,
    'C': 5,
    'P': 4,
    'F': 0
  };

  let subjectCount = 0;

  function createSubjectRow(name = '', credits = 3, grade = 'A+') {
    subjectCount++;
    const tr = document.createElement('tr');
    tr.id = `sub-row-${subjectCount}`;
    tr.innerHTML = `
      <td>
        <input type="text" class="input-control sub-name" placeholder="Course ${subjectCount}" value="${name}">
      </td>
      <td>
        <input type="number" class="input-control sub-credit" value="${credits}" min="1" max="8" step="0.5">
      </td>
      <td>
        <select class="input-control sub-grade">
          ${Object.keys(gradeValues).map(g => `<option value="${g}" ${g === grade ? 'selected' : ''}>${g} (${gradeValues[g]})</option>`).join('')}
        </select>
      </td>
      <td style="text-align: center;">
        <button type="button" class="btn-icon-danger remove-row-btn" title="Remove Course">✕</button>
      </td>
    `;

    tr.querySelector('.remove-row-btn').addEventListener('click', () => {
      if (tableBody.children.length > 1) {
        tr.remove();
        calculateSgpa();
      } else {
        alert('At least one course is required for calculation.');
      }
    });

    tableBody.appendChild(tr);
  }

  // Pre-fill realistic CSE Courses
  const defaultCourses = [
    { name: 'Operating Systems', credits: 4, grade: 'O' },
    { name: 'Database Management Systems', credits: 4, grade: 'A+' },
    { name: 'Computer Networks', credits: 3, grade: 'A' },
    { name: 'Web Technologies', credits: 3, grade: 'A+' },
    { name: 'Software Engineering Lab', credits: 2, grade: 'O' }
  ];

  defaultCourses.forEach(c => createSubjectRow(c.name, c.credits, c.grade));

  addBtn.addEventListener('click', () => createSubjectRow());

  function calculateSgpa() {
    const rows = tableBody.querySelectorAll('tr');
    let totalCredits = 0;
    let totalPoints = 0;

    rows.forEach(r => {
      const credit = parseFloat(r.querySelector('.sub-credit').value) || 0;
      const gradeStr = r.querySelector('.sub-grade').value;
      const gradeVal = gradeValues[gradeStr] !== undefined ? gradeValues[gradeStr] : 0;

      totalCredits += credit;
      totalPoints += (credit * gradeVal);
    });

    const sgpaVal = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    const sgpaDisplay = document.getElementById('sgpa-result');
    const totalCreditsDisplay = document.getElementById('total-credits-val');
    const sgpaBadge = document.getElementById('sgpa-badge');

    sgpaDisplay.textContent = sgpaVal.toFixed(2);
    totalCreditsDisplay.textContent = totalCredits;

    if (sgpaVal >= 8.5) {
      sgpaBadge.textContent = 'Outstanding';
      sgpaBadge.className = 'status-tag status-emerald';
    } else if (sgpaVal >= 7.0) {
      sgpaBadge.textContent = 'Very Good';
      sgpaBadge.className = 'status-tag status-emerald';
    } else if (sgpaVal >= 5.5) {
      sgpaBadge.textContent = 'Good / Average';
      sgpaBadge.className = 'status-tag status-amber';
    } else {
      sgpaBadge.textContent = 'Needs Improvement';
      sgpaBadge.className = 'status-tag status-rose';
    }

    saveToHistoryLog('SGPA Calculation', `SGPA: ${sgpaVal.toFixed(2)} (${totalCredits} credits)`);
  }

  calcBtn.addEventListener('click', calculateSgpa);
  resetBtn.addEventListener('click', () => {
    tableBody.innerHTML = '';
    subjectCount = 0;
    defaultCourses.forEach(c => createSubjectRow(c.name, c.credits, c.grade));
    calculateSgpa();
  });

  calculateSgpa();
}

/* -------------------------------------------------------------------------- */
/* 3. TARGET CGPA PREDICTOR MATH                                              */
/* -------------------------------------------------------------------------- */
function initTargetCgpaPredictor() {
  const calcTargetBtn = document.getElementById('calc-target-btn');
  const resultBox = document.getElementById('target-result-box');

  calcTargetBtn.addEventListener('click', () => {
    const semsCompleted = parseInt(document.getElementById('target-past-sems').value) || 1;
    const currentCgpa = parseFloat(document.getElementById('target-current-cgpa').value) || 0;
    const desiredCgpa = parseFloat(document.getElementById('target-desired-cgpa').value) || 0;

    // Formula: Desired * (Sems + 1) - Current * Sems
    const requiredSgpa = (desiredCgpa * (semsCompleted + 1)) - (currentCgpa * semsCompleted);

    resultBox.style.display = 'block';

    if (requiredSgpa > 10.0) {
      resultBox.style.borderLeftColor = 'var(--accent-rose)';
      resultBox.innerHTML = `⚠️ <strong>Target Unreachable in 1 Sem:</strong> You need an SGPA of <strong>${requiredSgpa.toFixed(2)}</strong> in the next semester (exceeds max 10.0 scale). Try aiming for a slightly lower CGPA or spreading the target across 2 semesters.`;
    } else if (requiredSgpa <= 0) {
      resultBox.style.borderLeftColor = 'var(--accent-emerald)';
      resultBox.innerHTML = `🎉 <strong>Already Achieved!</strong> You are already well above your target CGPA. Maintain your current performance!`;
    } else {
      resultBox.style.borderLeftColor = 'var(--primary)';
      resultBox.innerHTML = `🎯 <strong>Required Next Sem SGPA:</strong> You need to score an SGPA of <strong>${requiredSgpa.toFixed(2)}</strong> in Semester ${semsCompleted + 1} to reach your overall target CGPA of ${desiredCgpa.toFixed(1)}.`;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 4. PERCENTAGE CALCULATOR                                                   */
/* -------------------------------------------------------------------------- */
function initPercentageCalculator() {
  const cgpaInput = document.getElementById('cgpa-val-input');
  const formulaSelect = document.getElementById('cgpa-formula-select');
  const calcCgpaPercentBtn = document.getElementById('calc-cgpa-percent-btn');
  const cgpaPercentResult = document.getElementById('cgpa-percent-result');

  function calculateCgpaToPercent() {
    const cgpa = parseFloat(cgpaInput.value) || 0;
    const formula = formulaSelect.value;
    let percent = (formula === 'sub075') ? ((cgpa - 0.75) * 10) : (cgpa * 9.5);

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    cgpaPercentResult.textContent = `${percent.toFixed(2)}%`;
    saveToHistoryLog('CGPA to %', `CGPA: ${cgpa} ➔ ${percent.toFixed(2)}%`);
  }

  calcCgpaPercentBtn.addEventListener('click', calculateCgpaToPercent);

  // Marks to %
  const marksObtained = document.getElementById('marks-obtained-input');
  const totalMarks = document.getElementById('total-marks-input');
  const calcMarksBtn = document.getElementById('calc-marks-percent-btn');
  const marksResult = document.getElementById('marks-percent-result');
  const divisionBadge = document.getElementById('division-badge');

  function calculateMarksToPercent() {
    const obtained = parseFloat(marksObtained.value) || 0;
    const total = parseFloat(totalMarks.value) || 1;

    const percent = (obtained / total) * 100;
    marksResult.textContent = `${percent.toFixed(2)}%`;

    if (percent >= 75) {
      divisionBadge.textContent = '1st Class with Distinction';
      divisionBadge.className = 'status-tag status-emerald';
    } else if (percent >= 60) {
      divisionBadge.textContent = 'First Division';
      divisionBadge.className = 'status-tag status-emerald';
    } else if (percent >= 50) {
      divisionBadge.textContent = 'Second Division';
      divisionBadge.className = 'status-tag status-amber';
    } else {
      divisionBadge.textContent = 'Pass / Fail';
      divisionBadge.className = 'status-tag status-rose';
    }

    saveToHistoryLog('Marks to %', `${obtained}/${total} ➔ ${percent.toFixed(2)}%`);
  }

  calcMarksBtn.addEventListener('click', calculateMarksToPercent);
}

/* -------------------------------------------------------------------------- */
/* 5. ATTENDANCE & BUNK PREDICTOR                                             */
/* -------------------------------------------------------------------------- */
function initAttendanceCalculator() {
  const totalClassesInput = document.getElementById('total-classes-input');
  const attendedClassesInput = document.getElementById('attended-classes-input');
  const targetThresholdInput = document.getElementById('target-threshold-input');

  const gaugeFill = document.getElementById('gauge-fill');
  const attendancePercentageText = document.getElementById('attendance-percentage-text');

  const bunkStatusTitle = document.getElementById('bunk-status-title');
  const bunkInsightVal = document.getElementById('bunk-insight-val');
  const bunkInsightText = document.getElementById('bunk-insight-text');

  const circumference = 2 * Math.PI * 68; // 427.25

  function updateAttendance() {
    const total = parseInt(totalClassesInput.value) || 0;
    const attended = parseInt(attendedClassesInput.value) || 0;
    const target = parseFloat(targetThresholdInput.value) || 75;

    if (total <= 0) return;

    const currentPercent = Math.min((attended / total) * 100, 100);

    const strokeDashoffset = circumference - (currentPercent / 100) * circumference;
    gaugeFill.style.strokeDashoffset = strokeDashoffset;

    attendancePercentageText.textContent = `${currentPercent.toFixed(1)}%`;

    if (currentPercent >= target) {
      gaugeFill.style.stroke = 'var(--accent-emerald)';
      const maxBunkable = Math.floor((attended * 100 / target) - total);
      bunkStatusTitle.textContent = 'Attendance Gauge (Safe)';
      bunkInsightVal.textContent = `Safe Zone: You can bunk ${maxBunkable} lectures`;
      bunkInsightText.textContent = `Your attendance will remain above ${target}% threshold even if you skip the next ${maxBunkable} lecture(s).`;
    } else {
      gaugeFill.style.stroke = 'var(--accent-rose)';
      const needed = Math.ceil((target * total - 100 * attended) / (100 - target));
      bunkStatusTitle.textContent = 'Attendance Gauge (Shortage Alert)';
      bunkInsightVal.textContent = `Shortage: Attend next ${needed} lectures`;
      bunkInsightText.textContent = `You must attend the next ${needed} consecutive lectures without missing any to recover your attendance to ${target}%.`;
    }

    saveToHistoryLog('Attendance', `${attended}/${total} (${currentPercent.toFixed(1)}%)`);
  }

  [totalClassesInput, attendedClassesInput, targetThresholdInput].forEach(inp => {
    inp.addEventListener('input', updateAttendance);
  });

  updateAttendance();
}

/* -------------------------------------------------------------------------- */
/* 6. WHATSAPP SUMMARY COPY FEATURE                                           */
/* -------------------------------------------------------------------------- */
function initCopySummary() {
  const copyBtn = document.getElementById('copy-summary-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', () => {
    const sgpaVal = document.getElementById('sgpa-result').textContent;
    const attendanceVal = document.getElementById('attendance-percentage-text').textContent;
    const bunkInsight = document.getElementById('bunk-insight-val').textContent;

    const summaryText = `🎓 *CampusTools Academic Summary*\n• *Current SGPA:* ${sgpaVal}\n• *Attendance Rate:* ${attendanceVal}\n• *Bunk Status:* ${bunkInsight}\n\n_Calculated via CampusTools_`;

    navigator.clipboard.writeText(summaryText).then(() => {
      copyBtn.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy Summary for WhatsApp';
      }, 2500);
    }).catch(() => {
      alert(summaryText);
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 7. LOCAL HISTORY LOG                                                       */
/* -------------------------------------------------------------------------- */
function saveToHistoryLog(type, details) {
  let history = JSON.parse(localStorage.getItem('campustools_history') || '[]');
  const entry = {
    type,
    details,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  history.unshift(entry);
  if (history.length > 6) history = history.slice(0, 6);

  localStorage.setItem('campustools_history', JSON.stringify(history));
  renderHistoryList(history);
}

function loadHistoryLog() {
  const history = JSON.parse(localStorage.getItem('campustools_history') || '[]');
  renderHistoryList(history);

  const clearBtn = document.getElementById('clear-history-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('campustools_history');
      renderHistoryList([]);
    });
  }
}

function renderHistoryList(history) {
  const container = document.getElementById('history-list');
  if (!container) return;

  if (history.length === 0) {
    container.innerHTML = '<li class="history-row" style="color: var(--text-muted); justify-content: center;">No calculations logged yet</li>';
    return;
  }

  container.innerHTML = history.map(item => `
    <li class="history-row">
      <div>
        <span style="font-weight: 600; color: var(--text-main);">${item.type}:</span>
        <span style="color: var(--text-muted); margin-left: 0.4rem;">${item.details}</span>
      </div>
      <span style="font-size: 0.75rem; color: var(--text-dim); font-family: var(--font-mono);">${item.time}</span>
    </li>
  `).join('');
}
