# 🎟️ Event Management Portal

A full-stack MERN application for discovering and managing college/public events.

---

## 📁 Project Structure

```
event-portal/
├── backend/
│   ├── config/         → MongoDB connection
│   ├── controllers/    → Business logic (auth, events, registrations)
│   ├── middleware/      → JWT auth middleware
│   ├── models/          → Mongoose schemas (User, Event, Registration)
│   ├── routes/          → Express routes
│   ├── server.js        → Entry point
│   └── .env.example     → Environment variable template
│
└── frontend/
    └── src/
        ├── components/  → Navbar, EventCard, EventFilters, EventForm
        ├── context/     → AuthContext (global auth state)
        ├── pages/       → Home, Login, Register, EventDetail, MyRegistrations, AdminDashboard
        ├── routes/      → PrivateRoute, AdminRoute guards
        ├── services/    → Axios API calls (api.js)
        └── App.jsx      → Root with routing
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/event_portal
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend runs at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint              | Access  | Description       |
|--------|-----------------------|---------|-------------------|
| POST   | /api/auth/register    | Public  | Register user     |
| POST   | /api/auth/login       | Public  | Login user        |
| GET    | /api/auth/me          | Private | Get current user  |

### Events
| Method | Endpoint              | Access       | Description         |
|--------|-----------------------|--------------|---------------------|
| GET    | /api/events           | Public       | Get all events      |
| GET    | /api/events/:id       | Public       | Get single event    |
| POST   | /api/events           | Admin only   | Create event        |
| PUT    | /api/events/:id       | Admin only   | Update event        |
| DELETE | /api/events/:id       | Admin only   | Delete event        |

Query Params for GET /api/events: `category`, `date`, `location`, `search`

### Registrations (RSVP)
| Method | Endpoint                              | Access       | Description             |
|--------|---------------------------------------|--------------|-------------------------|
| GET    | /api/registrations/my                 | Private      | My registrations        |
| POST   | /api/registrations/:eventId           | Private      | RSVP for event          |
| PUT    | /api/registrations/:eventId/cancel    | Private      | Cancel registration     |
| GET    | /api/registrations/:eventId/attendees | Admin only   | Get event attendees     |

---

## 🗄️ Database Collections

### Users
```json
{ "name": "string", "email": "string", "password": "hashed", "role": "user|admin" }
```

### Events
```json
{ "title": "string", "description": "string", "category": "Tech|Cultural|...", "date": "Date", "location": "string", "createdBy": "ObjectId" }
```

### Registrations
```json
{ "userId": "ObjectId", "eventId": "ObjectId", "status": "registered|cancelled" }
```

---

## 🚀 Features

- ✅ JWT Authentication (Register / Login)
- ✅ Role-based access (User / Admin)
- ✅ Event listing with Category, Date, Location, Search filters
- ✅ RSVP / Cancel registration
- ✅ Admin Dashboard — Create, Edit, Delete events
- ✅ View Attendees per event
- ✅ Protected routes (frontend + backend)
- ✅ Toast notifications
- ✅ Responsive UI with TailwindCSS

---

## 🛠️ Tech Stack

| Layer    | Tech                              |
|----------|-----------------------------------|
| Frontend | React, Vite, TailwindCSS, Axios   |
| Backend  | Node.js, Express.js               |
| Database | MongoDB, Mongoose                 |
| Auth     | JWT, bcryptjs                     |
| Routing  | React Router DOM v6               |
| UI/UX    | react-icons, react-toastify       |
