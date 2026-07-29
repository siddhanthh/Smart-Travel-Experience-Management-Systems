import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { tripService } from '../services/tripService';
import { notificationService } from '../services/notificationService';
import { feedService } from '../services/feedService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import TripList from '../components/Trips/TripList';
import PostCard from '../components/Feed/PostCard';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [trips, setTrips] = useState([]);
  const [posts, setPosts] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  function loadFeed() {
    feedService
      .getAllFeed({ limit: 5 })
      .then((feedData) => {
        const raw = feedData.data ?? feedData.posts ?? feedData;
        setPosts(Array.isArray(raw) ? raw : []);
      })
      .catch(() => {});
  }

  useEffect(() => {
    Promise.all([
      tripService.list({ mine: true, limit: 6 }),
      notificationService.unreadCount(),
      feedService.getAllFeed({ limit: 5 }),
    ])
      .then(([tripData, unreadData, feedData]) => {
        const rawTrips = tripData.trips ?? tripData.data ?? tripData;
        setTrips(Array.isArray(rawTrips) ? rawTrips : []);
        setUnread(unreadData.count ?? unreadData.unreadCount ?? 0);
        const rawPosts = feedData.data ?? feedData.posts ?? feedData;
        setPosts(Array.isArray(rawPosts) ? rawPosts : []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading your dashboard…" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-slate-500">
          You have {unread} unread notification{unread === 1 ? '' : 's'}.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/feed" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          Explore Feed 📸
        </Link>
        <Link to="/trips" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Browse trips
        </Link>
        <Link to="/notifications" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          View notifications
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Your trips</h2>
        <TripList trips={trips} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Community Activity 🌍</h2>
          <Link to="/feed" className="text-xs font-semibold text-blue-600 hover:underline">
            View full feed →
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">No activity yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <PostCard
                key={post._id || post.id}
                post={post}
                currentUserId={user?.id}
                isAdmin={isAdmin}
                onDeleted={loadFeed}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
