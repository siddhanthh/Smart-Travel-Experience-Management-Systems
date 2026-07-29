import { useState } from 'react';
import { feedService } from '../../services/feedService';
import CommentSection from './CommentSection';

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');

function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export default function PostCard({ post, currentUserId, isAdmin, onDeleted }) {
  const [reacted, setReacted] = useState(post.reactedByMe ?? false);
  const [reactionCount, setReactionCount] = useState(post.reactionCount ?? 0);
  const [comments, setComments] = useState(post.comments ?? []);
  const [showComments, setShowComments] = useState(false);

  async function toggleReaction() {
    setReacted((r) => !r);
    setReactionCount((c) => (reacted ? c - 1 : c + 1));
    try {
      await feedService.toggleReaction(post._id || post.id);
    } catch {
      // revert on failure
      setReacted((r) => !r);
      setReactionCount((c) => (reacted ? c + 1 : c - 1));
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this post?')) return;
    await feedService.deletePost(post._id || post.id);
    onDeleted?.(post._id || post.id);
  }

  const canDelete = isAdmin || post.userId === currentUserId;
  const displayName = post.authorName || post.userName || post.user?.name || `User #${post.userId}`;
  const initial = displayName.replace(/^User #/, 'U')[0]?.toUpperCase() || 'U';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {initial}
          </div>
          <div>
            <span className="block text-sm font-semibold text-slate-900">
              {displayName}
            </span>
            {post.tripTitle && (
              <span className="inline-block text-xs font-medium text-slate-500">
                📍 {post.tripTitle}
              </span>
            )}
          </div>
        </div>
        {canDelete && (
          <button onClick={handleDelete} className="text-xs font-medium text-red-500 hover:underline">
            Delete
          </button>
        )}
      </div>
      {post.content && <p className="mt-2 text-sm text-slate-700">{post.content}</p>}
      {post.images?.length === 1 && (
        <div className="mt-3 overflow-hidden rounded-xl bg-slate-900/5 flex items-center justify-center">
          <img
            src={getImageUrl(post.images[0])}
            alt=""
            className="max-h-[420px] w-full rounded-xl object-contain"
          />
        </div>
      )}
      {post.images?.length > 1 && (
        <div className={`mt-3 grid gap-2 ${post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
          {post.images.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-lg bg-slate-100 aspect-[4/3]">
              <img
                src={getImageUrl(src)}
                alt=""
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
        <button onClick={toggleReaction} className={reacted ? 'text-blue-600' : 'hover:text-blue-600'}>
          👍 {reactionCount}
        </button>
        <button onClick={() => setShowComments((s) => !s)} className="hover:text-blue-600">
          💬 {comments.length} comments
        </button>
      </div>
      {showComments && (
        <CommentSection
          postId={post._id || post.id}
          comments={comments}
          onCommentAdded={(c) => setComments((prev) => [...prev, c])}
        />
      )}
    </div>
  );
}
