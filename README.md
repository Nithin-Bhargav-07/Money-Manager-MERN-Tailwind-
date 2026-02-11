## Money Manager (MERN + Tailwind)

This is a production-ready scaffold for a **Money Manager** application built with:

- **Frontend**: React (Vite + TypeScript), Tailwind CSS, Recharts, Axios, React Router, Framer Motion
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT auth, bcryptjs

### Backend setup
#  Money Manager (MERN Stack)

##  Overview

**Money Manager** is a full-stack web application designed to help users track their income and expenses efficiently. Unlike standard expense trackers, this application enforces strict **data integrity rules** and supports **dual-division tracking** (Personal vs. Office), making it suitable for professionals who need to segregate their finances.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js), it features real-time data visualization, secure JWT authentication, and professional reporting tools.

---

##  Key Features

###  Security & Integrity (Hackathon Specials)
* **12-Hour Immutable Ledger:** To prevent data tampering, transactions **cannot be edited or deleted 12 hours after creation**. This logic is enforced strictly on the backend.
* **JWT Authentication:** Secure user sessions with JSON Web Tokens. Only registered users can access the dashboard.
* **Protected Routes:** Backend middleware ensures that users can only access their own data.

### Financial Management
* **Dual Division Tracking:** Categorize every transaction as either **"Personal"** or **"Office"** for better segregation.
* **Dynamic Dashboard:** Real-time visualization of Total Income, Expenses, and Balance using **Recharts**.
* **Smart Filtering:** Filter transactions by Date Range, Category, and Division.

### Reports & Exports
* **Visual Analytics:** Pie charts and bar graphs breakdown spending habits.
* **Export Engine:** * **PDF Export:** Generates a professional transaction report using `jspdf-autotable`.
    * **CSV Export:** Instant download for spreadsheet analysis.

---

##  Tech Stack

### Frontend
* **React (Vite):** Fast, modern UI library.
* **Tailwind CSS:** For responsive and clean styling.
* **Recharts:** For data visualization.
* **Axios:** For API communication.

### Backend
* **Node.js & Express:** RESTful API architecture.
* **MongoDB Atlas:** Cloud database for scalable data storage.
* **Mongoose:** ODM for schema validation.
* **JWT (JSON Web Token):** For secure authentication.

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/money-manager.git](https://github.com/your-username/money-manager.git)
cd money-manager
```bash
cd backend
npm install
cp .env.example .env # or create .env with your own values
npm run dev
```

Required env vars:

- `MONGO_URI`
- `JWT_SECRET`
- `PORT` (optional, default 5000)
- `CLIENT_URL` (e.g. http://localhost:5173)

### Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` in `frontend` if needed:

```bash
VITE_API_URL=http://localhost:5000/api
```

Then open the printed URL (typically http://localhost:5173).


