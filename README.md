# STEMS — Smart Travel Experience Management System

**Live Demo:** https://stems-ruby.vercel.app

A full-stack group travel management platform. STEMS centralizes itinerary planning, expense settlement, and group communication into a single application.

---

## Features

- **Trip Management** — Create and manage trips with destination, date ranges, and capacity limits. Role-based access separates organizers from members.
- **Expense Tracking** — Log shared expenses and automatically calculate balances between group members. Includes a settlement flow to clear debts.
- **Booking Management** — Track flights, hotels, and activities per trip with conflict and duplication prevention.
- **Social Feed** — Share updates and photos within a trip. Supports likes and comments with optimistic UI updates.
- **Notifications** — Alerts for new expenses, feed posts, and trip activity.
- **Admin Panel** — System-wide stats, user role management, and audit logging for security trails.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router DOM |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Backend | Node.js, Express |
| Relational DB | MySQL |
| Document DB | MongoDB |
| Auth | JWT (cookie + Bearer header fallback) |
| Deployment | Vercel (frontend), Render (backend) |
| Databases | Railway (MySQL), MongoDB Atlas |

---

## Project Structure

```
STEMS/
├── frontend/        # React + Vite application
├── backend/         # Node.js + Express API server
└── README.md
```

---

## Local Setup

### Prerequisites

- Node.js v18+
- MySQL v8.0+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
npm install
```

Create a `.env` file with the following variables:

```
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
MONGO_URI=
JWT_SECRET=
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

---

## Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| MySQL Database | Railway |
| MongoDB | Atlas |

---

## License

MIT
