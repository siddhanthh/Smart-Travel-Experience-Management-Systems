import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    `flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* Left Side: Brand & Menu */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              S
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
              STEMS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center gap-1.5">
              <NavLink to="/feed" className={linkClass}>
                Feed
              </NavLink>
              <NavLink to="/trips" className={linkClass}>
                Trips
              </NavLink>
              <NavLink to="/notifications" className={({ isActive }) => `relative ${linkClass({ isActive })}`}>
                Notifications
                {unread > 0 && (
                  <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
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

        {/* Right Side: Search, User Profile, Logout & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Search Bar */}
          {user && (
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const q = e.target.q.value;
                if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
              }}
              className="relative hidden sm:block"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <input 
                name="q"
                type="text"
                placeholder="Search..."
                className="w-40 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 w-44 md:w-52 focus:w-60 dark:border-slate-800 dark:bg-slate-950 dark:focus:bg-slate-900 dark:text-white"
              />
            </form>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              {/* User Identity Info */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 font-bold text-sm dark:bg-blue-900/20 dark:text-blue-400">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:inline text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user.name}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-white transition">
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10 transition"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {user && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition md:hidden"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {user && mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/95 md:hidden space-y-3">
          {/* Mobile Search */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const q = e.target.q.value;
              if (q) {
                setMobileMenuOpen(false);
                navigate(`/search?q=${encodeURIComponent(q)}`);
              }
            }}
            className="relative w-full"
          >
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </div>
            <input 
              name="q"
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
            />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            <NavLink to="/feed" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
              Feed
            </NavLink>
            <NavLink to="/trips" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
              Trips
            </NavLink>
            <NavLink to="/notifications" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
              Notifications
              {unread > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </NavLink>
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={linkClass}>
                Admin
              </NavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
