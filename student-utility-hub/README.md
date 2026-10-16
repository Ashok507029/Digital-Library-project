# CampusTools - Student Academic & Attendance Suite

A clean, modern, handcrafted web application built for college students to calculate SGPA/CGPA, percentage conversions, attendance percentage, and smart bunk projections.

Developed by **Vikas** (B.Tech Computer Science & Engineering).

---

## 🌟 Key Features

- **SGPA & Credit-Weighted GPA Calculator**: Pre-filled with standard Computer Science & Engineering courses ("Operating Systems", "DBMS", "Computer Networks", "Web Tech"). Dynamic credit point calculation with standard letter grade scale (`O`, `A+`, `A`, `B+`, `B`, `C`, `P`, `F`).
- **Target CGPA Predictor**: Calculates the exact SGPA required in the upcoming semester to reach a target cumulative CGPA.
- **Percentage Converters**:
  - CGPA to Percentage (AICTE `(CGPA - 0.75) * 10` and CBSE `CGPA * 9.5` scale toggle).
  - Exam Marks Secured to Percentage with Division Classification.
- **Attendance & Smart Bunk Predictor**:
  - Circular SVG attendance progress gauge.
  - **Safe Bunk Predictor**: Calculates how many upcoming lectures you can skip while remaining above 75%.
  - **Shortage Recovery**: Calculates consecutive classes required to catch up to 75%.
- **Copy Summary for WhatsApp**: 1-click button to copy calculated SGPA & attendance status for sharing.
- **Calculation History**: Automatic browser persistence using `localStorage`.

---

## 🛠️ Built With

- **HTML5**: Semantic tags & accessible structure.
- **CSS3**: Custom design system using `Inter` typography, CSS Variables, and clean Slate/Indigo theme.
- **JavaScript (ES6+)**: Vanilla JS DOM handling & calculations.

---

## 🚀 How to Run Locally

Simply open `index.html` in any web browser, or launch using Node.js:

```bash
node server.js
```

Open `http://localhost:3000` in your browser.
