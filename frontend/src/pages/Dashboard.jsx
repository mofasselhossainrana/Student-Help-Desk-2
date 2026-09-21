import { Link } from 'react-router-dom';
import AppLayout from '../Components/AppLayout';

const label = (value) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

function Dashboard({ tickets, onLogout }) {
  const count = (status) => tickets.filter((ticket) => ticket.status === status).length;
  const stats = [['All tickets', tickets.length, '▤'], ['Open', count('OPEN'), '○'], ['In progress', count('IN PROGRESS'), '◌'], ['Closed', count('CLOSED'), '✓']];
  return <AppLayout onLogout={onLogout}><header className="page-heading"><div><p className="eyebrow">STUDENT SUPPORT CENTER</p><h1>Welcome back</h1><p>Here is a live view of your support requests.</p></div><Link className="button button-primary" to="/create-ticket">+ New ticket</Link></header><section className="stats-grid">{stats.map(([name, value, icon]) => <article className="stat-card" key={name}><span className="stat-icon">{icon}</span><div><p>{name}</p><strong>{value}</strong></div></article>)}</section><section className="content-card recent-card"><div className="section-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent tickets</h2></div><Link to="/tickets">View all →</Link></div>{tickets.length ? <div className="ticket-mini-list">{tickets.slice(0, 5).map((ticket) => <Link to={`/tickets/${ticket.id}`} key={ticket.id}><span><strong>{ticket.title}</strong><small>#{ticket.id} · {label(ticket.priority)} priority</small></span><span className={`badge status-${String(ticket.status).toLowerCase().replace(' ', '-')}`}>{label(ticket.status)}</span></Link>)}</div> : <div className="empty-state"><span>▤</span><h3>No tickets yet</h3><p>When you need help, your requests will appear here.</p><Link className="button button-secondary" to="/create-ticket">Create your first ticket</Link></div>}</section></AppLayout>;
}
export default Dashboard;
