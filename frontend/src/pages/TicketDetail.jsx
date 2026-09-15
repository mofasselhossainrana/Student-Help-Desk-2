import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [id]);

  const fetchTicket = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `http://127.0.0.1:8000/api/tickets/${id}/`,
      {
        headers: {
          Authorization: 'Token ' + token,
        },
      }
    );

    const data = await response.json();
    setTicket(data);
  };

  const fetchComments = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://127.0.0.1:8000/api/comments/',
      {
        headers: {
          Authorization: 'Token ' + token,
        },
      }
    );

    const data = await response.json();
    const filtered = data.filter(
      (comment) => comment.ticket === Number(id)
    );

    setComments(filtered);
  };

  const handleAddComment = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://127.0.0.1:8000/api/comments/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
        body: JSON.stringify({
          content: newComment,
          ticket: Number(id),
        }),
      }
    );

    if (response.ok) {
      setNewComment('');
      fetchComments();
    } else {
      console.log('Failed to add comment');
    }
  };

  if (!ticket) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <button onClick={() => navigate('/tickets')}>
        ← Back to List
      </button>

      <h1>{ticket.title}</h1>

      <p>Status: {ticket.status}</p>

      <p>Priority: {ticket.priority}</p>

      <p>Description: {ticket.description}</p>

      <h3>Comments</h3>

      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.content}
          </li>
        ))}
      </ul>

      <textarea
        placeholder="Add a comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />

      <br />

      <button onClick={handleAddComment}>
        Add Comment
      </button>
    </div>
  );
}

export default TicketDetail;