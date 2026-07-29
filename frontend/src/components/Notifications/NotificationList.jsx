import { notificationService } from '../../services/notificationService';

const typeIcons = {
  trip_invite: '✈️',
  booking_confirmed: '✅',
  expense_added: '💸',
};

export default function NotificationList({ notifications, onChanged }) {
  async function markRead(id) {
    await notificationService.markRead(id);
    onChanged?.();
  }

  if (!notifications?.length) {
    return <p className="py-8 text-center text-sm text-slate-500">You're all caught up!</p>;
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
      {notifications.map((n) => (
        <li
          key={n._id || n.id}
          className={`flex items-start gap-3 p-4 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
        >
          <span className="text-lg">{typeIcons[n.type] || '🔔'}</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">{n.title}</p>
            <p className="text-sm text-slate-500">{n.message}</p>
            <p className="mt-1 text-xs text-slate-400">
              {new Date(n.createdAt).toLocaleString('en-IN')}
            </p>
          </div>
          {!n.isRead && (
            <button
              onClick={() => markRead(n._id || n.id)}
              className="shrink-0 text-xs font-medium text-blue-600 hover:underline"
            >
              Mark read
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
