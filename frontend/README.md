# STEMS Frontend

React frontend for the Smart Travel Experience Management System, built to match
`IMPLEMENTATION_PLAN.md` (Section 6 — Frontend File Structure, Section 8 — API Endpoints).

## Stack
- Vite + React 19
- React Router v6
- Axios (with `withCredentials: true` — the backend sets the JWT as an httpOnly cookie,
  so the browser sends it automatically; no manual token handling needed)
- Tailwind CSS v4 (via `@tailwindcss/vite`, no separate config file needed)

## Getting started

```bash
npm install
cp .env.example .env   # point VITE_API_URL at your backend
npm run dev
```

The app expects the backend at `http://localhost:5000/api` by default (matches the plan's
`.env` example). Change `VITE_API_URL` in `.env` if your backend runs elsewhere.

## Structure

```
src/
├── components/     # Layout, Auth, Trips, Feed, Bookings, Expenses, Notifications, Admin, Common
├── pages/          # One component per route
├── context/        # AuthContext — global user/session state
├── hooks/          # useAuth, usePagination
├── services/       # One file per backend resource — axios calls only, no UI logic
├── App.jsx         # Route tree + route guards
└── main.jsx        # Entry point
```

## Routing & auth guards

- `/login`, `/register` — public
- Everything else under `AppLayout` requires a logged-in session (`ProtectedRoute`)
- `/admin` additionally requires `user.role === 'admin'` (`AdminRoute`)
- On load, `AuthContext` calls `GET /auth/me` to restore the session from the cookie

## Notes on backend response shapes

Since your backend controllers weren't available to inspect directly, service calls and
pages use light defensive unwrapping like:

```js
setTrips(data.trips ?? data.data ?? data);
```

This lets it work whether your controllers return `{ trips: [...] }`, `{ data: [...] }`, or
a bare array. Once your backend is live, you may want to tighten these to match your exact
response envelope — search for `??` in `src/pages/*.jsx` to find them.

Field names assumed from the plan's schema (e.g. `trip.max_members`, `booking.booking_date`,
`expense.paid_by`) match `database/schema.sql` in the plan exactly. Fields not defined in the
plan's schema (like `trip.member_count`, `post.reactedByMe`, `user.name` attached to Mongo
notification/audit documents) are guesses for convenience — your controllers will need to
either supply them via JOIN/populate, or you can strip them from the UI.

## What's NOT included

- No test setup (Section 13 of the plan — add Vitest/RTL if needed)
- No Swagger/Postman consumption — this just calls the REST endpoints directly
- No file upload progress UI for post images (basic multipart FormData is wired up in
  `feedService.createPost`, but you may want a nicer upload experience)
