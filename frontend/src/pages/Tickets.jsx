import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import { prettyLabel, priorityClass, statusClass } from '../utils/format';

function TicketRows({ tickets }) {
  if (!tickets.length) {
    return (
      <div className="empty-state">
        <span>⌕</span>
        <h3>No tickets found</h3>
        <p>Try changing your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="ticket-list">
      {tickets.map((ticket) => (
        <Link className="ticket-row" to={`/tickets/${ticket.id}`} key={ticket.id}>
          <div className="ticket-id">#{ticket.id}</div>
          <div className="ticket-title">
            <strong>{ticket.title}</strong>
            <small>{ticket.description}</small>
          </div>
          <span className={`badge ${priorityClass(ticket.priority)}`}>
            {prettyLabel(ticket.priority)}
          </span>
          <span className={`badge ${statusClass(ticket.status)}`}>
            {prettyLabel(ticket.status)}
          </span>
          <span className="ticket-arrow">→</span>
        </Link>
      ))}
    </div>
  );
}

function Tickets({ tickets, onCreateTicket, onLogout, onSearch, mode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const runSearch = useCallback(
    async (nextSearch = search, nextStatus = status, nextPriority = priorityFilter) => {
      setLoading(true);
      setError('');

      try {
        await onSearch(nextSearch, nextStatus, nextPriority);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [onSearch, priorityFilter, search, status]
  );

  useEffect(() => {
    if (mode === 'list') {
      setSearch('');
      setStatus('');
      setPriorityFilter('');
      runSearch('', '', '');
    }
  }, [mode, runSearch]);

  useEffect(() => {
    if (mode !== 'search') return undefined;

    const timer = window.setTimeout(() => {
      runSearch(search, status, priorityFilter);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [mode, priorityFilter, runSearch, search, status]);

  const create = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await onCreateTicket({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setMessage('Ticket created successfully.');
    } catch (err) {
      setError(err.message || 'Unable to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showCreate = mode === 'create';
  const showSearch = mode === 'search';

  return (
    <AppLayout onLogout={onLogout}>
      <header className="page-heading">
        <div>
          <p className="eyebrow">
            {showCreate ? 'NEW SUPPORT REQUEST' : showSearch ? 'FIND SUPPORT REQUESTS' : 'SUPPORT REQUESTS'}
          </p>
          <h1>{showCreate ? 'Create a ticket' : showSearch ? 'Search tickets' : 'My tickets'}</h1>
          <p>
            {showCreate
              ? 'Tell us what you need help with.'
              : 'Search, filter, and follow the progress of your requests.'}
          </p>
        </div>
        {!showCreate && <Link className="button button-primary" to="/create-ticket">+ New ticket</Link>}
      </header>

      {showCreate ? (
        <form className="content-card ticket-form" onSubmit={create}>
          <label>
            Ticket title
            <input
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Cannot access my university email"
            />
          </label>
          <label>
            Description
            <textarea
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue and anything you have already tried."
              rows="6"
            />
          </label>
          <label>
            Priority
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="LOW">Low — can wait</option>
              <option value="MEDIUM">Medium — normal request</option>
              <option value="HIGH">High — needs attention</option>
            </select>
          </label>
          {message && <p className="form-message success">{message}</p>}
          {error && <p className="form-message error">{error}</p>}
          <div>
            <button className="button button-primary" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit ticket'}
            </button>
            {message && (
              <button type="button" className="button button-text" onClick={() => navigate('/tickets')}>
                View tickets →
              </button>
            )}
          </div>
        </form>
      ) : (
        <>
          <section className="content-card filters">
            <label className="search-field">
              ⌕
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by ticket title"
              />
            </label>
            <label>
              Status
              <select
                value={status}
                onChange={(event) => {
                  setStatus(event.target.value);
                  runSearch(search, event.target.value, priorityFilter);
                }}
              >
                <option value="">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </label>
            <label>
              Priority
              <select
                value={priorityFilter}
                onChange={(event) => {
                  setPriorityFilter(event.target.value);
                  runSearch(search, status, event.target.value);
                }}
              >
                <option value="">All priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </label>
          </section>
          {error && <p className="form-message error">{error}</p>}
          <section className="content-card ticket-table">
            <div className="section-heading">
              <div>
                <h2>{showSearch ? 'Search results' : 'All tickets'}</h2>
                <p>{loading ? 'Updating results…' : `${tickets.length} ticket${tickets.length === 1 ? '' : 's'} found`}</p>
              </div>
            </div>
            <TicketRows tickets={tickets} />
          </section>
        </>
      )}
    </AppLayout>
  );
}

export default Tickets;
