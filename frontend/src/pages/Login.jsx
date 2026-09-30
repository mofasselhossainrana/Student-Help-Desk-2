import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/auth';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await loginRequest({ username, password });
      login(data.token);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message || 'Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-orb" />
        <div>
          <img src="/studentdesk-logo.svg" alt="StudentDesk" className="auth-logo login-logo" />
          <p className="eyebrow">CAMPUS SUPPORT, SIMPLIFIED</p>
          <h1>Help is always<br />within reach.</h1>
          <p>Submit requests, follow progress, and connect with campus support in one friendly space.</p>
          <div className="auth-feature"><b>✓</b> Track every support request</div>
          <div className="auth-feature"><b>✓</b> Stay updated in real time</div>
        </div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={handleLogin}>
          <Link className="mobile-brand" to="/">
            <img src="/studentdesk-logo.svg" alt="StudentDesk" /> StudentDesk
          </Link>
          <p className="eyebrow">WELCOME BACK</p>
          <h2>Sign in to your desk</h2>
          <p className="form-intro">Use your student account to continue.</p>
          <label>
            Username
            <input
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </label>
          <label>
            Password
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>
          {message && <p className="form-message error">{message}</p>}
          <button className="button button-primary button-wide" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="auth-switch">
            New to StudentDesk? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
