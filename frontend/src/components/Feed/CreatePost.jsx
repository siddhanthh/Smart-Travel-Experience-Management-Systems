import { useState } from 'react';
import { feedService } from '../../services/feedService';
import ErrorMessage from '../Common/ErrorMessage';

export default function CreatePost({ tripId, onPosted }) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    setError('');
    setLoading(true);
    try {
      const post = await feedService.createPost({ tripId, content, images });
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
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-4">
      <ErrorMessage message={error} />
      <textarea
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Reached the beach! 🏖️"
        className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      <div className="mt-2 flex items-center justify-between">
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
