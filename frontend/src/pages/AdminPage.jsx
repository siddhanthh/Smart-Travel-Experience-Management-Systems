import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import Dashboard from '../components/Admin/Dashboard';
import UserManagement from '../components/Admin/UserManagement';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const TABS = [
  { key: 'Overview', label: 'System Overview' },
  { key: 'Users', label: 'User Directory' },
  { key: 'Audit logs', label: 'Audit Trail' },
];

const actionBadgeStyles = {
  CREATE: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  UPDATE: 'bg-blue-100 text-blue-800 border-blue-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200',
  LOGIN: 'bg-purple-100 text-purple-800 border-purple-200',
};

function formatTimestamp(log) {
  const dateVal = log.timestamp || log.createdAt || log.updatedAt;
  if (!dateVal) return 'Recently';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return 'Recently';
  return d.toLocaleString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Command Center
          </h1>
          <p className="text-sm text-slate-500">
            System administration, user access controls, and security audit logs
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      {/* Styled Admin Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-sm font-semibold">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-xl px-4 py-2 transition ${
              tab === t.key
                ? 'bg-blue-600 font-bold text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <Dashboard stats={stats} />}
      {tab === 'Users' && <UserManagement users={users} onChanged={load} />}
      {tab === 'Audit logs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Security audit trail log</span>
            <span>Total logs: {auditLogs.length}</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Entity Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                      No security audit logs recorded yet.
                    </td>
                  </tr>
                )}
                {auditLogs.map((log) => {
                  const actionType = String(log.action || '').toUpperCase();
                  const badgeStyle = Object.keys(actionBadgeStyles).find((k) => actionType.includes(k));
                  return (
                    <tr key={log._id || log.id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                        {formatTimestamp(log)}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        {log.userName || log.user_name || (log.userId ? `User #${log.userId}` : 'System Admin')}
                        {log.userEmail && <span className="block text-xs font-normal text-slate-400">{log.userEmail}</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold ${
                          actionBadgeStyles[badgeStyle] || 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-slate-600">
                        {log.entity} <span className="text-slate-400">#{log.entityId}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
