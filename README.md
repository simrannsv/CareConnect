# CareConnect ✦ AI-Powered Home Services Platform

CareConnect is a full-stack MERN application that connects customers needing home services with verified local service professionals. By leveraging plain-language AI problem classification and intelligent provider ranking, customers don't need to know technical service jargon to get matched with the right professional.

---

## 🔑 Demo & Admin Credentials

To quickly test and inspect all admin features, use the default seeded admin account:

- **Admin Email:** `admin@careconnect.com`
- **Admin Password:** `admin123`

> **Note:** To seed the admin account into your local database, run:
> ```bash
> cd backend/server
> node seed/seedAdmin.js
> ```

---

## ✨ Features by Role

### 👤 Customer Features
- **Natural Problem Description:** Describe home service issues in plain language without needing technical category names.
- **AI Auto-Classification:** Category selection is optional; the built-in AI classifier automatically detects the service category, required skills, and urgency.
- **AI-Matched Professionals:** View top recommended verified service providers for your request with:
  - Match Score Badge (e.g. `✦ 92% Match`)
  - Base Starting Price (e.g. `Starting from ₹350`)
  - Provider Ratings & Review Count
  - Clear Match Reasons (e.g. `✔ Matches skills needed • Serves location • Free today`)
- **Quotes & Bookings:** Receive custom quotes from providers, accept quotes, and manage bookings.

### 🛠️ Service Provider Features
- **Profile Management:** Set up categories, skills, bio, service areas, and base pricing.
- **Requests Marketplace:** View open customer requests matching your service categories.
- **Quote Submission:** Send custom price quotes and messages directly to customers.
- **Availability Schedule:** Manage open service slots and bookings.

### 🛡️ Admin Features
- **Category Management:** Add new service categories or remove inactive ones.
- **Verified Providers Directory:** View and manage all active, verified service providers on the platform.
- **Verification Requests Workflow:** Review pending provider applications and approve (verify) or reject them. Approved providers automatically move to the verified directory.

---

## 💻 Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Vite, Vanilla CSS design system (lavender `#9370db` / `#7657e8` theme)
- **Backend:** Node.js, Express.js, Mongoose (MongoDB)
- **Validation & AI:** Zod schema validation, Keyword & scoring AI classification engine (`classifyRequest` & `rankProviders`)
- **Authentication:** JWT Bearer Token Auth with `AuthContext` state persistence

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend/server

# Install dependencies
npm install

# Configure environment variables (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/careconnect
JWT_SECRET=your_jwt_secret_key

# Seed Admin User
node seed/seedAdmin.js

# Start backend server
npm run dev
```

### 2. Frontend Setup
```bash
# Navigate to frontend directory
cd frontend/careconnect-client

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Repository Structure

```
CareConnect/
├── backend/server/
│   ├── controllers/      # Auth, Request, Provider, Quote, Admin controllers
│   ├── models/           # User, Provider, Category, ServiceRequest, Quote, Booking
│   ├── routes/           # Express API endpoints
│   ├── services/         # AI Classifier & Provider Ranking engine
│   └── seed/             # Database seed scripts
└── frontend/careconnect-client/
    ├── src/
    │   ├── api/          # Axios instance & API modules
    │   ├── components/   # Navbar, ProtectedRoute, Loader
    │   ├── context/      # AuthContext state
    │   ├── pages/        # Customer, Provider, Admin, and Public pages
    │   └── styles/       # Modular CSS design system
```

---

## 📝 License
This project is open source under the MIT License.
