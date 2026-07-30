import { useState, useEffect } from 'react';
import { feedService } from '../../services/feedService';
import CommentSection from './CommentSection';
import ConfirmModal from '../Common/ConfirmModal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    setReacted(post.reactedByMe ?? false);
  }, [post.reactedByMe]);

  useEffect(() => {
    setReactionCount(post.reactionCount ?? 0);
  }, [post.reactionCount]);

  async function toggleReaction() {
    if (isLiking) return;
    setIsLiking(true);
    setReacted((r) => !r);
    setReactionCount((c) => (reacted ? c - 1 : c + 1));
    try {
      await feedService.toggleReaction(post._id || post.id);
    } catch {
      // revert on failure
      setReacted((r) => !r);
      setReactionCount((c) => (reacted ? c + 1 : c - 1));
    } finally {
      setIsLiking(false);
    }
  }

  async function confirmDelete() {
    await feedService.deletePost(post._id || post.id);
    setShowDeleteModal(false);
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
                {post.tripTitle}
              </span>
            )}
          </div>
        </div>
        {canDelete && (
          <button onClick={() => setShowDeleteModal(true)} className="cursor-pointer text-xs font-medium text-red-500 hover:underline">
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
      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
        <button
          onClick={toggleReaction}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            reacted ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <svg className="h-4 w-4" fill={reacted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>
          {reacted ? 'Liked' : 'Like'} ({reactionCount})
        </button>
        <button
          onClick={() => setShowComments((s) => !s)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-600 hover:bg-slate-50 transition"
        >
          Comments ({comments.length})
        </button>
      </div>
      {showComments && (
        <CommentSection
          postId={post._id || post.id}
          comments={comments}
          onCommentAdded={(c) => setComments((prev) => [...prev, c])}
        />
      )}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
