import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
  }`;

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <nav className="space-y-1">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/feed" className={linkClass}>Feed</NavLink>
        <NavLink to="/trips" className={linkClass}>Trips</NavLink>
        <NavLink to="/notifications" className={linkClass}>Notifications</NavLink>
        <NavLink to="/search" className={linkClass}>Search</NavLink>
        {user.role === 'admin' && (
          <NavLink to="/admin" className={linkClass}>Admin</NavLink>
        )}
      </nav>
    </aside>
  );
}
