import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { createTicketComment, fetchTicketComments } from '../api/comments';
import { fetchTicket } from '../api/tickets';
import { formatDate, prettyLabel, priorityClass, statusClass } from '../utils/format';

function TicketDetail({ onLogout }) {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadError, setLoadError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [sending, setSending] = useState(false);

  const loadComments = useCallback(async () => {
    const data = await fetchTicketComments(id);
    setComments(data);
  }, [id]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadError('');
        setCommentError('');
        setTicket(await fetchTicket(id));
        await loadComments();
      } catch (err) {
        setLoadError(err.message);
      }
    };

    load();
  }, [id, loadComments]);

  const addComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) return;

    setSending(true);
    setCommentError('');

    try {
      await createTicketComment(id, newComment);
      setNewComment('');
      await loadComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout onLogout={onLogout}>
      {loadError && !ticket ? (
        <div className="content-card error-state">
          <h2>Something went wrong</h2>
          <p>{loadError}</p>
          <Link className="button button-secondary" to="/tickets">Back to tickets</Link>
        </div>
      ) : !ticket ? (
        <div className="loading-state"><span /> Loading ticket…</div>
      ) : (
        <>
          <Link className="back-link" to="/tickets">← Back to tickets</Link>
          <header className="detail-heading">
            <div>
              <p className="eyebrow">TICKET #{ticket.id}</p>
              <h1>{ticket.title}</h1>
            </div>
            <div className="badge-group">
              <span className={`badge ${priorityClass(ticket.priority)}`}>
                {prettyLabel(ticket.priority)}
              </span>
              <span className={`badge ${statusClass(ticket.status)}`}>
                {prettyLabel(ticket.status)}
              </span>
            </div>
          </header>

          <section className="detail-grid">
            <article className="content-card description-card">
              <h2>Description</h2>
              <p>{ticket.description}</p>
            </article>
            <aside className="content-card metadata">
              <h2>Ticket details</h2>
              <p>
                <span>Submitted by</span>
                <strong>{ticket.user?.username || `User #${ticket.user?.id || ticket.user}`}</strong>
              </p>
              <p>
                <span>Created</span>
                <strong>{formatDate(ticket.created_at)}</strong>
              </p>
              <p>
                <span>Last updated</span>
                <strong>{formatDate(ticket.updated_at)}</strong>
              </p>
            </aside>
          </section>

          <section className="content-card comments-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">CONVERSATION</p>
                <h2>Comments ({comments.length})</h2>
              </div>
            </div>
            {comments.length ? (
              <div className="comments-list">
                {comments.map((comment) => (
                  <article key={comment.id}>
                    <span className="comment-avatar">
                      {(comment.user?.username || 'U').slice(0, 1).toUpperCase()}
                    </span>
                    <div>
                      <strong>{comment.user?.username || 'Campus user'}</strong>
                      <small>{formatDate(comment.created_at)}</small>
                      <p>{comment.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">No comments yet. Start the conversation below.</p>
            )}
            <form className="comment-form" onSubmit={addComment}>
              <textarea
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                placeholder="Add a comment or update…"
                rows="4"
              />
              <button className="button button-primary" disabled={sending}>
                {sending ? 'Sending…' : 'Post comment'}
              </button>
            </form>
            {commentError && <p className="form-message error">{commentError}</p>}
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default TicketDetail;
