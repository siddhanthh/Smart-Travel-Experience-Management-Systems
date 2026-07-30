import { useState } from 'react';
import { adminService } from '../../services/adminService';

export default function UserManagement({ users = [], onChanged }) {
  const [busyId, setBusyId] = useState(null);
  const [search, setSearch] = useState('');

  async function handleRoleToggle(user) {
    setBusyId(user.id);
    try {
      const nextRole = user.role === 'admin' ? 'user' : 'admin';
      await adminService.updateUser(user.id, { role: nextRole });
      onChanged?.();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(user) {
    if (!confirm(`Are you sure you want to delete user ${user.name} (${user.email})?`)) return;
    setBusyId(user.id);
    try {
      await adminService.deleteUser(user.id);
      onChanged?.();
    } finally {
      setBusyId(null);
    }
  }

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      {/* User Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none shadow-sm"
          />
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3.5">User</th>
              <th className="px-4 py-3.5">Email</th>
              <th className="px-4 py-3.5">Role</th>
              <th className="px-4 py-3.5">Member Since</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((u) => {
              const initial = u.name ? u.name.charAt(0).toUpperCase() : '?';
              return (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-4 py-3.5 font-medium text-slate-900 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 shrink-0">
                      {initial}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{u.email}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 border-purple-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : 'Traveler'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      disabled={busyId === u.id}
                      onClick={() => handleRoleToggle(u)}
                      className="mr-3 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition disabled:opacity-50"
                    >
                      {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                    <button
                      disabled={busyId === u.id}
                      onClick={() => handleDelete(u)}
                      className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
