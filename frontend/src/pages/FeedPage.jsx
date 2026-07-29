import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { feedService } from '../services/feedService';
import { tripService } from '../services/tripService';
import { useAuth } from '../hooks/useAuth';
import CreatePost from '../components/Feed/CreatePost';
import PostCard from '../components/Feed/PostCard';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

export default function FeedPage() {
  const { id: tripId } = useParams();
  const { user, isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  function load() {
    setLoading(true);
    if (tripId) {
      Promise.all([feedService.getFeedForTrip(tripId), tripService.getById(tripId)])
        .then(([feedData, tripData]) => {
          const rawPosts = feedData.data ?? feedData.posts ?? feedData;
          setPosts(Array.isArray(rawPosts) ? rawPosts : []);
          setTrip(tripData.data ?? tripData.trip ?? tripData);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      feedService
        .getAllFeed()
        .then((feedData) => {
          const rawPosts = feedData.data ?? feedData.posts ?? feedData;
          setPosts(Array.isArray(rawPosts) ? rawPosts : []);
          setTrip(null);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }

  useEffect(load, [tripId]);

  return (
    <div className="space-y-4">
      {tripId && (
        <div>
          <Link to={`/trips/${tripId}`} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
            ← Back to {trip?.title || 'Trip'}
          </Link>
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-900">
        {tripId ? (
          <>Feed {trip && <span className="text-base font-normal text-slate-500">· {trip.title}</span>}</>
        ) : (
          'Collective Activity Feed'
        )}
      </h1>
      <ErrorMessage message={error} />
      <CreatePost tripId={tripId} onPosted={load} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {posts.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-sm font-semibold text-slate-700">No posts yet</p>
              <p className="mt-1 text-xs text-slate-500">Be the first to share a photo or memory from your trip.</p>
            </div>
          )}
          {posts.map((post) => (
            <PostCard
              key={post._id || post.id}
              post={post}
              currentUserId={user?.id}
              isAdmin={isAdmin}
              onDeleted={load}
            />
          ))}
        </div>
      )}
    </div>
  );
}
