import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationService
      .unreadCount()
      .then((d) => setUnread(d.count ?? d.unreadCount ?? 0))
      .catch(() => {});
  }, [user]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-bold text-blue-600">
          STEMS
        </Link>
        {user && (
          <div className="hidden items-center gap-5 text-sm font-medium text-slate-600 md:flex">
            <Link to="/feed" className="hover:text-blue-600">Feed</Link>
            <Link to="/trips" className="hover:text-blue-600">Trips</Link>
            <Link to="/search" className="hover:text-blue-600">Search</Link>
            <Link to="/notifications" className="relative hover:text-blue-600">
              Notifications
              {unread > 0 && (
                <span className="absolute -right-3 -top-2 rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                  {unread}
                </span>
              )}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-600">Admin</Link>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
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
