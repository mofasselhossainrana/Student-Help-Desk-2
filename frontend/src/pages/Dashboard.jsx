import Sidebar from '../components/Sidebar';

function Dashboard({ onLogout }) {
  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={onLogout} />

      <h1>SIDEBAR TEST</h1>

      <main className="dashboard-content">
        <h1>Welcome Back 👋</h1>

        <p className="dashboard-subtitle">
          Here is what's happening with your support tickets.
        </p>

        <div className="dashboard-cards">

          <div className="dashboard-card">
            <span>🎫</span>
            <div>
              <p>Total Tickets</p>
              <h2>0</h2>
            </div>
          </div>

          <div className="dashboard-card">
            <span>🟢</span>
            <div>
              <p>Open Tickets</p>
              <h2>0</h2>
            </div>
          </div>

          <div className="dashboard-card">
            <span>✅</span>
            <div>
              <p>Closed Tickets</p>
              <h2>0</h2>
            </div>
          </div>

        </div>

        <div className="recent-tickets">
          <h2>Recent Tickets</h2>
          <p>No recent tickets to show.</p>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;

