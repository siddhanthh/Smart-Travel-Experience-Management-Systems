# STEMS (Smart Travel Experience Management System)

STEMS is a full-stack group travel management platform. It centralizes itinerary planning, financial settlements, and group communication into a single unified application. The system is built with a decoupled architecture utilizing a React SPA frontend and a dual-database Node.js backend to handle both relational transactional data and flexible document storage.

## Features

- **Trip & Role Management**: Core orchestration for trips including date boundaries, destinations, and capacity limits. Implements role-based access control (RBAC) separating Trip Organizers from standard Members.
- **Financial Ledger & Settlements**: Automated expense tracking and debt calculation. Includes a settlement engine that computes optimizing split algorithms and enforces double-entry verification.
- **Booking Orchestration**: Centralized management for flights, hotels, and activities, featuring compound database constraints to prevent duplicate bookings and schedule conflicts.
- **Social Feed & Real-time Alerts**: Integrated social capabilities utilizing optimistic UI updates for interactions, accompanied by a comprehensive notification and alerts system.
- **Admin & Audit Systems**: Dedicated administration dashboard with system-wide KPI aggregation, user lifecycle management, and immutable audit logging.

## System Architecture

### Frontend
- **Framework**: React 18 / Vite
- **Routing**: React Router DOM (Nested routing with protected route guards)
- **State & Network**: Context API for global state, Axios for API communication (configured with global interceptors for auth header injection and standardized error normalization)
- **Styling**: Tailwind CSS

### Backend
- **Core**: Node.js / Express
- **Relational Data (MySQL)**: Handles ACID-compliant transactions for Users, Trips, Bookings, and Expenses. Employs row-level locking for concurrency control and compound unique keys for data integrity.
- **Document Data (MongoDB)**: Handles flexible schema requirements and aggregations for Social Feeds, Notifications, and Audit Logs.
- **Authentication**: JWT-based authentication supporting both `httpOnly` cookies and fallback `Authorization: Bearer` strategies for strict mobile browser (ITP) compatibility.

## Local Development Setup

### Prerequisites
- Node.js (v18.x or higher)
- MySQL Server (v8.0+)
- MongoDB (v6.0+ or Atlas Cluster)

### Backend Services
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables by creating a `.env` file (reference `.env.example` if available). Required keys include `MYSQL_URI`, `MONGO_URI`, and `JWT_SECRET`.
4. Initialize the server:
   ```bash
   npm run dev
   ```

### Frontend Application
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment by creating a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

