# STEMS (Smart Travel Experience Management System)

STEMS is a comprehensive, full-stack application designed to manage group travel experiences. It handles everything from itineraries and bookings to expense splitting and social feeds, allowing groups to travel seamlessly together.

## 🌟 Key Features

* **Complete Trip Management**: Create trips, set destinations, and invite members. Role-based access control separates organizers from standard travelers.
* **Smart Expense Splitting**: Automatically calculate who owes whom. Log expenses, assign them to specific members, and use the "Settle Up" feature to manage debts.
* **Social Feed & Photo Sharing**: Share updates and photos within a trip. Features optimistic UI for lightning-fast likes and comments.
* **Booking & Itineraries**: Track flights, hotels, and activities with duplicate-prevention constraints.
* **Admin Dashboard**: Comprehensive KPI tracking, user management, and MongoDB-backed audit logging for security trails.
* **Real-time Notifications**: Alerts for new expenses, feed posts, and trip updates.

## 🛠️ Tech Stack

**Frontend (Vite + React)**
* **Core**: React 18, React Router DOM
* **Styling**: Tailwind CSS
* **Network**: Axios (with global interceptors for robust error handling and Bearer token injection)
* **Deployment**: Vercel

**Backend (Node.js + Express)**
* **Architecture**: Layered architecture (Routes → Controllers → Services)
* **Relational Database**: MySQL (for ACID transactions on Users, Trips, Bookings, and Expenses)
* **Document Database**: MongoDB (for flexible schemas on Social Feeds, Notifications, and Audit Logs)
* **Security**: JWT Authentication (supporting both `httpOnly` cookies and `Authorization: Bearer` headers for strict mobile browser compatibility)
* **Deployment**: Render

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v18+)
* MySQL Database
* MongoDB Instance (or MongoDB Atlas)

### Backend Setup
1. Navigate to the `backend` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` (or set up `MYSQL_URI`, `MONGO_URI`, `JWT_SECRET`, etc.)
4. Run the development server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Create a `.env` file and set `VITE_API_URL=http://localhost:5000/api`
4. Run the development server: `npm run dev`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](../../issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
