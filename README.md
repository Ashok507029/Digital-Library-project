# 📚 Alexandria Digital Library

A modern, full-stack Digital Library Management System with an interactive 3D Campus Block Map, multi-role authentication (Member, Librarian, Admin), QR-based borrowing, book reservation, and real-time catalog search.

---

## 🌟 Live Demo & Web App

- **Live Frontend**: [https://ashok507029.github.io/Digital-Library-project/](https://ashok507029.github.io/Digital-Library-project/)
- **Local API & Web**: `http://localhost:3000`

---

## 🚀 Key Features

- **📖 Dynamic Catalog**: Fast multi-parameter search, genre filters (NCERT, Competitive Exams, Literature, Science), and cover previews.
- **🏛️ 3D Campus Academic Block**: Interactive Three.js 3D visualization of the academic block and library floors.
- **👥 Multi-Role Portals**:
  - **Member Portal**: View borrowed books, renewal, reservation, and fines.
  - **Librarian Desk**: Manage book issuance, returns, stock levels, and active readers.
  - **Admin Dashboard**: System-wide analytics, staff management, book additions, and reports.
- **📱 QR Code Generation**: Instant QR code generation for books, receipts, and membership IDs.
- **⚡ Dual Mode (Live / Offline Fallback)**: Works smoothly with full offline fallback if backend API is not running, and seamlessly connects to MongoDB when online.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Modern CSS3 (Dark Mode / Custom Glassmorphism Theme), Vanilla JavaScript (ES6+), Three.js (3D Map), QRCode.js.
- **Backend**: Node.js, Express.js, RESTful API.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JWT & Role-Based Access Control.

---

## 💻 Local Setup & Installation

### 1. Prerequisites
- Node.js (v16+)
- MongoDB (running locally or MongoDB Atlas)

### 2. Clone Repository
```bash
git clone https://github.com/Ashok507029/Digital-Library-project.git
cd Digital-Library-project
```

### 3. Start Backend Server
```bash
cd server
npm install
node seed.js    # Seed initial 23 books and test members
node server.js  # Starts on http://localhost:3000
```

### 4. Open in Browser
Open `http://localhost:3000` in your web browser.

---

## 👤 Author
- **Ashok Choudhary** ([@Ashok507029](https://github.com/Ashok507029))
