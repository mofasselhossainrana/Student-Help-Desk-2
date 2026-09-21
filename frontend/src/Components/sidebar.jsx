import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => { onLogout(); navigate('/login'); };
  const navigation = [['⌂', 'Dashboard', '/dashboard'], ['▤', 'My Tickets', '/tickets'], ['+', 'Create Ticket', '/create-ticket'], ['⌕', 'Search Tickets', '/search']];

  return <aside className="sidebar">
    <NavLink className="brand" to="/dashboard" aria-label="StudentDesk dashboard"><img src="/studentdesk-logo.png" alt="StudentDesk" /><span><strong>StudentDesk</strong><small>Mini Help Desk</small></span></NavLink>
    <nav className="sidebar-nav" aria-label="Main navigation">{navigation.map(([icon, label, to]) => <NavLink key={to} to={to}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}</nav>
    <div className="sidebar-bottom"><button type="button" onClick={handleLogout}><span aria-hidden="true">↪</span> Logout</button></div>
  </aside>;
}

export default Sidebar;
