import { useState } from 'react';
import { feedService } from '../../services/feedService';
import CommentSection from './CommentSection';

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

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-slate-800">
          {post.userName || `User #${post.userId}`}
        </span>
        {canDelete && (
          <button onClick={handleDelete} className="text-xs text-red-500 hover:underline">
            Delete
          </button>
        )}
      </div>
      {post.content && <p className="mt-2 text-sm text-slate-700">{post.content}</p>}
      {post.images?.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-2">
          {post.images.map((src, i) => (
            <img key={i} src={src} alt="" className="h-32 w-full rounded-lg object-cover" />
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
