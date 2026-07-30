import { useState, useEffect } from 'react';
import { feedService } from '../../services/feedService';
import { tripService } from '../../services/tripService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreatePost({ tripId: propTripId, onPosted }) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      onPosted?.(post);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setContent('');
    setImages([]);
    setError('');
  }

  return (
    <div className="flex justify-start">
      {/* Create Post Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Create Post
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div 
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl animate-in fade-in zoom-in duration-200 dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Create New Post</h3>
              <button
                onClick={handleClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
              >
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <ErrorMessage message={error} />
              
              {!propTripId && myTrips.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Select Trip</label>
                  <select
                    value={selectedTripId}
                    onChange={(e) => setSelectedTripId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                  >
                    {myTrips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({t.destination})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Post Message</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share a photo or memory from your trip..."
                  className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition dark:border-slate-850 dark:bg-slate-950 dark:text-white"
                />
              </div>
              
              {images.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">Photos</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {images.map((img, i) => (
                      <div key={i} className="relative shrink-0">
                        <img src={URL.createObjectURL(img)} className="h-20 w-20 object-cover rounded-lg border border-slate-200 dark:border-slate-800" alt="Preview" />
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
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <input
                    id="imageUpload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
                    className="hidden"
                  />
                  <label htmlFor="imageUpload" className="flex items-center gap-1.5 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition duration-150">
                    <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    Add Photos
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={loading || (!content.trim() && images.length === 0)}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {loading ? 'Posting…' : 'Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
