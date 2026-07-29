import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      <h1 className="text-2xl font-bold text-slate-900">
        {tripId ? (
          <>Feed {trip && <span className="text-base font-normal text-slate-500">· {trip.title}</span>}</>
        ) : (
          'Collective Activity Feed 🌍'
        )}
      </h1>
      <ErrorMessage message={error} />
      <CreatePost tripId={tripId} onPosted={load} />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-3">
          {posts.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">No posts yet. Be the first to share!</p>
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
