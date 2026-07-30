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
        <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
          <Link to="/" className="text-xl font-extrabold text-blue-600 tracking-tight shrink-0">
            STEMS
          </Link>
          {user && (
            <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-1">
              <NavLink to="/dashboard" className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/feed" className={linkClass}>
                Feed
              </NavLink>
              <NavLink to="/trips" className={linkClass}>
                Trips
              </NavLink>
              <NavLink to="/search" className={linkClass}>
                Search
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

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
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
