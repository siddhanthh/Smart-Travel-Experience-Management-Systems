import { useState } from 'react';
import { feedService } from '../../services/feedService';

export default function CommentSection({ postId, comments = [], onCommentAdded }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const comment = await feedService.addComment(postId, text.trim());
      setText('');
      onCommentAdded?.(comment);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 border-t border-slate-100 pt-3">
      <ul className="space-y-2">
        {comments.map((c) => {
          const displayName = c.authorName || c.userName || c.user?.name || (c.userId ? `User #${c.userId}` : 'User');
          return (
            <li key={c._id || c.id} className="text-sm">
              <span className="font-semibold text-slate-800">{displayName}: </span>
              <span className="text-slate-600">{c.content}</span>
            </li>
          );
        })}
      </ul>
      <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment…"
          className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          disabled={loading}
          className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200"
        >
          Reply
        </button>
      </form>
    </div>
  );
}
