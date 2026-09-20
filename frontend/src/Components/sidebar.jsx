import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img
          src="/download.svg"
          alt="Student Help Desk"
        />
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">
          🏠 Dashboard
        </NavLink>

        <NavLink to="/tickets">
          🎫 My Tickets
        </NavLink>

        <NavLink to="/create-ticket">
          ➕ Create Ticket
        </NavLink>

        <NavLink to="/search">
          🔍 Search Tickets
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

