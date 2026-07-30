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

  function load(silent = false) {
    if (!silent) setLoading(true);
    notificationService
      .list({ page, limit })
      .then((data) => {
        const rawNotifs = data.data ?? data.notifications ?? data;
        setNotifications(Array.isArray(rawNotifs) ? rawNotifs : []);
        setTotalPages(data.pagination?.totalPages ?? data.totalPages ?? 1);
      })
      .finally(() => {
        if (!silent) setLoading(false);
      });
  }

  useEffect(() => {
    load(false);
    const interval = setInterval(() => load(true), 5000); // Silent live poll every 5 seconds
    return () => clearInterval(interval);
  }, [page]);

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
