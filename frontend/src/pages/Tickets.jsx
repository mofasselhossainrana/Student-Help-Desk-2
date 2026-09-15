import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Tickets({ tickets, onCreateTicket, onLogout }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');

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

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div>
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
        <option value="HIGH">High</option>
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