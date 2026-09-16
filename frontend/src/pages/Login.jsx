import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/login/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setMessage('Login successful!');
        onLogin();
        navigate('/dashboard');
      } else {
        setMessage('Login failed. Check username/password.');
      }
    } catch (error) {
      setMessage('Error connecting to server.');
      console.log(error);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* Left Side - Illustration */}
        <div className="login-visual">
          <div className="visual-content">
            <div className="visual-icon">🎓</div>

            <h1>Student Help Desk</h1>

            <p>
              Get support, track your tickets,
              and solve your problems easily.
            </p>

            <div className="visual-card">
              🎫
              <span>Manage your support tickets</span>
            </div>

            <div className="visual-card">
              💬
              <span>Communicate with support</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-container">

          <div className="login-form">

            <h2>Welcome Back 👋</h2>

            <p className="login-subtitle">
              Login to your student account
            </p>

            <label>Username</label>

            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="login-button"
              onClick={handleLogin}
            >
              Login
            </button>

            {message && (
              <p className="login-message">
                {message}
              </p>
            )}

            <p className="register-text">
              Don't have an account?{' '}
              <Link to="/register">Create an account</Link>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;

