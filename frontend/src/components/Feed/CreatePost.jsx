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
                {t.title} ({t.destination})
              </option>
            ))}
          </select>
        </div>
      )}
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share a photo or memory from your trip..."
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      
      {images.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <div key={i} className="relative shrink-0">
              <img src={URL.createObjectURL(img)} className="h-20 w-20 object-cover rounded-lg border border-slate-200" alt="Preview" />
              <button 
                type="button"
                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                className="cursor-pointer absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/60 text-xs text-white hover:bg-slate-900 transition"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <input
            id="imageUpload"
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
            className="hidden"
          />
          <label htmlFor="imageUpload" className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Add Photos
          </label>
        </div>
        <button
          disabled={loading || (!content.trim() && images.length === 0)}
          className="cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Posting…' : 'Post'}
        </button>
      </div>
    </form>
  );
}
