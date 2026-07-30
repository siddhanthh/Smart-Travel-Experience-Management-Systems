import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    function checkUnread() {
      notificationService
        .unreadCount()
        .then((d) => setUnread(d.count ?? d.unreadCount ?? 0))
        .catch(() => {});
    }
    checkUnread();
    const interval = setInterval(checkUnread, 5000);
    return () => clearInterval(interval);
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' : 'text-slate-600 hover:text-blue-600'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between px-4 py-3 gap-y-3">
        <div className="flex items-center gap-4 sm:gap-8 max-w-full">
          <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight shrink-0">
            STEMS
          </Link>
          {user && (
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-1 sm:pb-0 scrollbar-hide">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/feed" className={linkClass}>
                Feed
              </NavLink>
              <NavLink to="/trips" className={linkClass}>
                Trips
              </NavLink>

              <NavLink to="/notifications" className={({ isActive }) => `relative ${linkClass({ isActive })}`}>
                Notifications
                {unread > 0 && (
                  <span className="absolute -right-3 -top-1.5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unread}
                  </span>
                )}
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.q.value;
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="relative"
            >
              <svg className="absolute left-2.5 top-1.5 sm:top-2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              <input 
                name="q"
                type="text"
                placeholder="Search..."
                className="w-24 rounded-full border border-slate-300 bg-slate-50 py-1 sm:py-1.5 pl-8 pr-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all sm:w-48 sm:focus:w-64"
              />
            </form>
          )}
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
