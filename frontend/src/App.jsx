import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('token')
  );

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async (
    search = '',
    status = '',
    priority = ''
  ) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `http://127.0.0.1:8000/api/tickets/?search=${search}&status=${status}&priority=${priority}`,
      {
        headers: {
          Authorization: 'Token ' + token,
        },
      }
    );

    const data = await response.json();
    setTickets(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchTickets();
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setTickets([]);
  };

  const handleCreateTicket = async (ticketData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      'http://127.0.0.1:8000/api/tickets/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + token,
        },
        body: JSON.stringify(ticketData),
      }
    );

    if (response.ok) {
      await fetchTickets();
      return true;
    }

    console.log('Failed to create ticket');
    return false;
  };

  return (
    <Routes>
      <Route
  path="/login"
  element={
    isLoggedIn ? (
      <Navigate to="/dashboard" />
    ) : (
      <Login onLogin={handleLogin} />
    )
  }
/>
      <Route
  path="/dashboard"
  element={
    isLoggedIn ? (
      <Dashboard onLogout={handleLogout} />
    ) : (
      <Navigate to="/login" />
    )
  }
/>

      <Route
        path="/register"
        element={
          isLoggedIn ? (
            <Navigate to="/tickets" />
          ) : (
            <Register />
          )
        }
      />

      <Route
        path="/tickets"
        element={
          isLoggedIn ? (
            <Tickets
              tickets={tickets}
              onCreateTicket={handleCreateTicket}
              onLogout={handleLogout}
              onSearch={fetchTickets}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/tickets/:id"
        element={
          isLoggedIn ? (
            <TicketDetail />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={isLoggedIn ? '/dashboard' : '/login'}
          />
        }
      />
    </Routes>
  );
}

export default App;

