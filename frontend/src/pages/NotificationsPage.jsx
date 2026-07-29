import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import NotificationList from '../components/Notifications/NotificationList';
import Pagination from '../components/Common/Pagination';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { usePagination } from '../hooks/usePagination';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { page, limit, totalPages, setTotalPages, next, prev, goTo } = usePagination();

  function load() {
    setLoading(true);
    notificationService
      .list({ page, limit })
      .then((data) => {
        setNotifications(data.notifications ?? data.data ?? data);
        setTotalPages(data.totalPages ?? 1);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [page]);

  async function markAllRead() {
    await notificationService.markAllRead();
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <button onClick={markAllRead} className="text-sm font-medium text-blue-600 hover:underline">
          Mark all as read
        </button>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <NotificationList notifications={notifications} onChanged={load} />
      )}
      <Pagination page={page} totalPages={totalPages} onPrev={prev} onNext={next} onGoTo={goTo} />
    </div>
  );
}
