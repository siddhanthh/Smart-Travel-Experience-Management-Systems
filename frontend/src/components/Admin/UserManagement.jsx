import { useState } from 'react';
import { adminService } from '../../services/adminService';

export default function UserManagement({ users, onChanged }) {
  const [busyId, setBusyId] = useState(null);

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
    if (!confirm(`Delete user ${user.name}?`)) return;
    setBusyId(user.id);
    try {
      await adminService.deleteUser(user.id);
      onChanged?.();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users?.map((u) => (
            <tr key={u.id}>
              <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
              <td className="px-4 py-3 text-slate-500">{u.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">
                {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleRoleToggle(u)}
                  className="mr-3 text-xs font-medium text-blue-600 hover:underline"
                >
                  {u.role === 'admin' ? 'Demote' : 'Promote'}
                </button>
                <button
                  disabled={busyId === u.id}
                  onClick={() => handleDelete(u)}
                  className="text-xs font-medium text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
