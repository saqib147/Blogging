import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { createComment, createReply, deleteComment } from '../../api/comments';
import toast from 'react-hot-toast';

function CommentItem({ comment, blogAuthorId, onRefresh }) {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canDelete =
    user &&
    (user._id === comment.author?._id || user._id === blogAuthorId);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setSubmitting(true);
    try {
      await createReply(comment._id, replyText);
      setReplyText('');
      setShowReply(false);
      toast.success('Reply posted');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment._id);
      toast.success('Comment deleted');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const date = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <Avatar src={comment.author?.avatar} name={comment.author?.name} size="sm" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-neutral-heading">{comment.author?.name}</span>
            <span className="text-xs text-neutral-body/50">{date}</span>
          </div>
          <p className="text-sm text-neutral-body">{comment.text}</p>
          <div className="flex items-center gap-3 mt-2">
            {user && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-neutral-body/60 hover:text-primary transition-colors"
              >
                Reply
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-red-500/70 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          {showReply && (
            <form onSubmit={handleReply} className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 px-3 py-1.5 text-sm border border-neutral-body/15 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button type="submit" disabled={submitting} className="text-xs px-3 py-1.5">
                Reply
              </Button>
            </form>
          )}
        </div>
      </div>

      {comment.replies?.length > 0 && (
        <div className="ml-8 pl-4 border-l-2 border-neutral-body/10 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              blogAuthorId={blogAuthorId}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentThread({ blogId, blogAuthorId, comments, onRefresh }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await createComment(blogId, text);
      setText('');
      toast.success('Comment posted');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-neutral-heading">
        Comments ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Avatar src={user.avatar} name={user.name} size="sm" />
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share your thoughts..."
              className="flex-1 px-3 py-2 text-sm border border-neutral-body/15 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" disabled={submitting}>Post</Button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-neutral-body/60">Sign in to leave a comment.</p>
      )}

      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-sm text-neutral-body/50">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              blogAuthorId={blogAuthorId}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
}
