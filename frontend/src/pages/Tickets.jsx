import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Tickets({ tickets, onCreateTicket, onLogout, onSearch }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const navigate = useNavigate();

  const handleCreate = async () => {
    const success = await onCreateTicket({
      title,
      description,
      priority,
    });

    if (success) {
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;

    setSearch(value);
    onSearch(value, status, priorityFilter);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;

    setStatus(value);
    onSearch(search, value, priorityFilter);
  };

  const handlePriorityFilter = (e) => {
    const value = e.target.value;

    setPriorityFilter(value);
    onSearch(search, status, value);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="tickets-page">

      <h1>Tickets</h1>

      <h3>Create New Ticket</h3>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="high">High</option>
      </select>

      <br />

      <button onClick={handleCreate}>
        Create Ticket
      </button>

      <br />
      <br />

      <button onClick={handleLogout}>
        Logout
      </button>

      <h3>Search Tickets</h3>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={handleSearch}
      />

      <h3>Filter by Status</h3>

      <select
        value={status}
        onChange={handleStatusFilter}
      >
        <option value="">All Status</option>
        <option value="OPEN">Open</option>
        <option value="IN PROGRESS">In Progress</option>
        <option value="CLOSED">Closed</option>
      </select>

      <h3>Filter by Priority</h3>

      <select
        value={priorityFilter}
        onChange={handlePriorityFilter}
      >
        <option value="">All Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="high">High</option>
      </select>

      <h3>All Tickets</h3>

      <ul>
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            style={{ cursor: 'pointer' }}
          >
            {ticket.title} — {ticket.status} — {ticket.priority}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tickets;

