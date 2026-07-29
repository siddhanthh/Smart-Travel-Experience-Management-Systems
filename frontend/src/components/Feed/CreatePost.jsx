import { useState, useEffect } from 'react';
import { feedService } from '../../services/feedService';
import { tripService } from '../../services/tripService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreatePost({ tripId: propTripId, onPosted }) {
  const [selectedTripId, setSelectedTripId] = useState(propTripId || '');
  const [myTrips, setMyTrips] = useState([]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!propTripId) {
      tripService
        .list({ mine: true })
        .then((res) => {
          const list = res.trips ?? res.data ?? res;
          const array = Array.isArray(list) ? list : [];
          setMyTrips(array);
          if (array.length > 0) setSelectedTripId(array[0].id);
        })
        .catch(() => {});
    }
  }, [propTripId]);

  const targetTripId = propTripId || selectedTripId;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!targetTripId) {
      setError('Please select a trip to post in.');
      return;
    }
    if (!content.trim() && images.length === 0) return;
    setError('');
    setLoading(true);
    try {
      const post = await feedService.createPost({ tripId: targetTripId, content, images });
      setContent('');
      setImages([]);
      onPosted?.(post);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <ErrorMessage message={error} />
      {!propTripId && myTrips.length > 0 && (
        <div className="mb-2">
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            {myTrips.map((t) => (
              <option key={t.id} value={t.id}>
                📍 {t.title} ({t.destination})
              </option>
            ))}
          </select>
        </div>
      )}
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share a photo or memory from your trip… 📸"
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
          className="text-xs text-slate-500"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
