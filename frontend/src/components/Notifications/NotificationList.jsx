import { notificationService } from '../../services/notificationService';

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function NotificationList({ notifications, onChanged }) {
  async function markRead(id) {
    await notificationService.markRead(id);
    onChanged?.();
  }

  if (!notifications?.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">All caught up</p>
        <p className="mt-1 text-xs text-slate-500">You have no new notifications.</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {notifications.map((n) => (
        <li
          key={n._id || n.id}
          className={`flex items-start gap-3 p-4 hover:bg-slate-50/50 transition ${!n.isRead ? 'bg-blue-50/20' : ''}`}
        >
          {/* Status Dot */}
          <div className="pt-1.5 shrink-0">
            <span className={`block h-2 w-2 rounded-full ${!n.isRead ? 'bg-blue-600' : 'bg-slate-300'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-snug">{n.title}</p>
            <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
            <p className="mt-1 text-[11px] text-slate-400 font-medium">
              {formatRelativeTime(n.createdAt)}
            </p>
          </div>
          {!n.isRead && (
            <button
              onClick={() => markRead(n._id || n.id)}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
            >
              Mark read
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
