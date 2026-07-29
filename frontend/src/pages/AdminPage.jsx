import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import Dashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const TABS = ['Overview', 'Users', 'Audit logs'];

export default function AdminPage() {
  const [tab, setTab] = useState('Overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    Promise.all([adminService.stats(), adminService.listUsers(), adminService.auditLogs()])
      .then(([statData, userData, auditData]) => {
        setStats(statData.data ?? statData);
        const rawUsers = userData.data ?? userData.users ?? userData;
        const rawAudit = auditData.data ?? auditData.logs ?? auditData;
        setUsers(Array.isArray(rawUsers) ? rawUsers : []);
        setAuditLogs(Array.isArray(rawAudit) ? rawAudit : []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  if (loading) return <LoadingSpinner label="Loading admin dashboard…" />;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
      <ErrorMessage message={error} />

      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 text-sm font-medium ${
              tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Dashboard stats={stats} />}
      {tab === 'Users' && <UserManagement users={users} onChanged={load} />}
      {tab === 'Audit logs' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log._id || log.id}>
                  <td className="px-4 py-3 text-xs text-slate-400">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">{log.userName || `User #${log.userId}`}</td>
                  <td className="px-4 py-3 font-medium">{log.action}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {log.entity} #{log.entityId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
