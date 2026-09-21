import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SplashScreen from './pages/SplashScreen';
import TicketDetail from './pages/TicketDetail';
import Tickets from './pages/Tickets';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [tickets, setTickets] = useState([]);

  const fetchTickets = useCallback(async (search = '', status = '', priority = '') => {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${API_URL}/tickets/?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}&priority=${encodeURIComponent(priority)}`,
      { headers: { Authorization: `Token ${token}` } }
    );
    if (!response.ok) throw new Error('Unable to load tickets.');
    const data = await response.json();
    setTickets(data);
    return data;
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchTickets().catch((error) => console.error(error));
  }, [fetchTickets, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTickets([]);
  };

  const handleCreateTicket = async (ticketData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tickets/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Token ${token}` },
      body: JSON.stringify(ticketData),
    });
    if (!response.ok) return false;
    await fetchTickets();
    return true;
  };

  const protectedPage = (element) => (isLoggedIn ? element : <Navigate to="/login" replace />);

  return <Routes>
    <Route path="/" element={<SplashScreen isLoggedIn={isLoggedIn} />} />
    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsLoggedIn(true)} />} />
    <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
    <Route path="/dashboard" element={protectedPage(<Dashboard tickets={tickets} onLogout={handleLogout} />)} />
    <Route path="/tickets" element={protectedPage(<Tickets tickets={tickets} onCreateTicket={handleCreateTicket} onLogout={handleLogout} onSearch={fetchTickets} mode="list" />)} />
    <Route path="/create-ticket" element={protectedPage(<Tickets tickets={tickets} onCreateTicket={handleCreateTicket} onLogout={handleLogout} onSearch={fetchTickets} mode="create" />)} />
    <Route path="/search" element={protectedPage(<Tickets tickets={tickets} onCreateTicket={handleCreateTicket} onLogout={handleLogout} onSearch={fetchTickets} mode="search" />)} />
    <Route path="/tickets/:id" element={protectedPage(<TicketDetail onLogout={handleLogout} />)} />
    <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} replace />} />
  </Routes>;
}

export default App;
