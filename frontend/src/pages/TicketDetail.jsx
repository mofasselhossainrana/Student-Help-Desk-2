import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AppLayout from '../Components/AppLayout';

const pretty = (value) =>
  String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const date = (value) =>
  value ? new Date(value).toLocaleString() : 'Not available';

function TicketDetail({ onLogout }) {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const headers = () => ({
    Authorization: `Token ${localStorage.getItem('token')}`,
  });

  const fetchComments = async () => {
    const response = await fetch(
      'https://student-help-desk-2.onrender.com/api/comments/',
      {
        headers: headers(),
      }
    );

    if (!response.ok) throw new Error('Unable to load comments.');

    const data = await response.json();

    setComments(
      data.filter((comment) => comment.ticket === Number(id))
    );
  };

  useEffect(() => {
    const load = async () => {
      try {
        setError('');

        const response = await fetch(
          `https://student-help-desk-2.onrender.com/api/tickets/${id}/`,
          {
            headers: headers(),
          }
        );

        if (!response.ok) {
          throw new Error('Unable to load this ticket.');
        }

        setTicket(await response.json());

        await fetchComments();
      } catch (err) {
        setError(err.message);
      }
    };

    load();
  }, [id]);

  const addComment = async (event) => {
    event.preventDefault();

    if (!newComment.trim()) return;

    setSending(true);

    try {
      const response = await fetch(
        'https://student-help-desk-2.onrender.com/api/comments/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers(),
          },
          body: JSON.stringify({
            content: newComment,
            ticket: Number(id),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Unable to add comment.');
      }

      setNewComment('');

      await fetchComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout onLogout={onLogout}>
      {error && !ticket ? (
        <div className="content-card error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <Link className="button button-secondary" to="/tickets">
            Back to tickets
          </Link>
        </div>
      ) : !ticket ? (
        <div className="loading-state">
          <span /> Loading ticket…
        </div>
      ) : (
        <>
          <Link className="back-link" to="/tickets">
            ← Back to tickets
          </Link>

          <header className="detail-heading">
            <div>
              <p className="eyebrow">TICKET #{ticket.id}</p>
              <h1>{ticket.title}</h1>
            </div>

            <div className="badge-group">
              <span
                className={`badge priority-${String(
                  ticket.priority
                ).toLowerCase()}`}
              >
                {pretty(ticket.priority)}
              </span>

              <span
                className={`badge status-${String(ticket.status)
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {pretty(ticket.status)}
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
                <strong>User #{ticket.user}</strong>
              </p>

              <p>
                <span>Created</span>
                <strong>{date(ticket.created_at)}</strong>
              </p>

              <p>
                <span>Last updated</span>
                <strong>{date(ticket.updated_at)}</strong>
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
                      {String(comment.user)}
                    </span>

                    <div>
                      <strong>Campus user</strong>
                      <small>{date(comment.created_at)}</small>
                      <p>{comment.content}</p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">
                No comments yet. Start the conversation below.
              </p>
            )}

            <form className="comment-form" onSubmit={addComment}>
              <textarea
                value={newComment}
                onChange={(event) =>
                  setNewComment(event.target.value)
                }
                placeholder="Add a comment or update…"
                rows="4"
              />

              <button
                className="button button-primary"
                disabled={sending}
              >
                {sending ? 'Sending…' : 'Post comment'}
              </button>
            </form>

            {error && <p className="form-message error">{error}</p>}
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default TicketDetail;

