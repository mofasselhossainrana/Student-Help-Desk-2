import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import { createTicket, fetchTickets } from './api/tickets';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './pages/SplashScreen';
import TicketDetail from './pages/TicketDetail';
import Tickets from './pages/Tickets';

function AppRoutes() {
  const { isLoggedIn, isBootstrapping, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState('');

  const loadTickets = useCallback(async (search = '', status = '', priority = '') => {
    setTicketsLoading(true);
    setTicketsError('');

    try {
      const data = await fetchTickets(search, status, priority);
      setTickets(data);
      return data;
    } catch (error) {
      setTicketsError(error.message || 'Unable to load tickets.');
      throw error;
    } finally {
      setTicketsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadTickets().catch(() => {});
    } else {
      setTickets([]);
    }
  }, [isLoggedIn, loadTickets]);

  const handleCreateTicket = async (ticketData) => {
    await createTicket(ticketData);
    await loadTickets();
    return true;
  };

  if (isBootstrapping) {
    return <div className="loading-state"><span /> Checking session…</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<SplashScreen isLoggedIn={isLoggedIn} />} />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard
              tickets={tickets}
              loading={ticketsLoading}
              error={ticketsError}
              onLogout={logout}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <Tickets
              key="list"
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onLogout={logout}
              onSearch={loadTickets}
              mode="list"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-ticket"
        element={
          <ProtectedRoute>
            <Tickets
              key="create"
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onLogout={logout}
              onSearch={loadTickets}
              mode="create"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Tickets
              key="search"
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onLogout={logout}
              onSearch={loadTickets}
              mode="search"
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <ProtectedRoute>
            <TicketDetail onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
}

export default AppRoutes;
