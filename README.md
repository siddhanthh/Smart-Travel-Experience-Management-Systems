# STEMS (Smart Travel Experience Management System)

Live Application: https://stems-ruby.vercel.app

STEMS is a full-stack group travel management application. It centralizes trip planning, itinerary management, group expense splitting, and community updates into a single web platform.

## Features

- **Trip Management**: Create and organize trips, set date boundaries, manage destinations, and invite members with role-based permissions (Organizers vs Members).
- **Expense Splitting**: Automated expense tracking and group expense settlement with calculated balances between members.
- **Bookings & Itineraries**: Centralized tracking for flights, hotels, and activities associated with each trip.
- **Social Feed & Activity**: Share photos, posts, and comments within specific trips or across the community.
- **Admin Dashboard**: System administration tools for user management, system metrics, and audit log viewing.

## Tech Stack

| Frontend | Backend | Databases | Authentication & Tools |
| --- | --- | --- | --- |
| React 18 + Vite | Node.js + Express | MySQL (Relational Data) | JWT Authentication |
| Tailwind CSS | JavaScript | MongoDB (Document Data) | Axios, React Router DOM |

## Project Structure

```text
STEMS/
├── backend/
│   ├── config/          # Database configuration (MySQL & MongoDB)
│   ├── controllers/     # Route handlers for auth, trips, expenses, etc.
│   ├── middleware/      # Auth & error handling middleware
│   ├── models/          # MongoDB schemas & data access models
│   ├── routes/          # Express route definitions
│   └── services/        # Business logic layer
├── frontend/
│   ├── src/
│   │   ├── components/  # Modular UI components (Auth, Feed, Trips, Admin)
│   │   ├── context/     # Global state (AuthContext)
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page-level route views
│   │   └── services/    # API interaction services
│   └── vercel.json      # Frontend deployment configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- MySQL Server (v8.0+)
- MongoDB (v6.0+ or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/siddhanthh/Smart-Travel-Experience-Management-Systems.git
   cd Smart-Travel-Experience-Management-Systems
   ```

2. Setup the backend:
   ```bash
   cd backend
   npm install
   # Create a .env file with MYSQL_URI, MONGO_URI, and JWT_SECRET
   npm run dev
   ```

3. Setup the frontend:
   ```bash
   cd ../frontend
   npm install
   # Create a .env file with VITE_API_URL=http://localhost:5000/api
   npm run dev
   ```

## Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Render
- **Relational Data**: MySQL Database
- **Document Data**: MongoDB Atlas Cluster

## Key Learnings

- Built a full-stack web application with a decoupled React frontend and Express backend.
- Designed a hybrid dual-database architecture using MySQL for transactional data and MongoDB for flexible schemas.
- Implemented JWT authentication supporting cross-domain and mobile browser sessions.
- Deployed a production-ready application across Vercel and Render.

## License

MIT
