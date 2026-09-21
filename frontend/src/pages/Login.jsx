import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/login/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error('Login failed. Check your username and password.');
      localStorage.setItem('token', data.token); onLogin(); navigate('/dashboard');
    } catch (error) { setMessage(error.message || 'Error connecting to server.'); }
    finally { setLoading(false); }
  };

  return <div className="auth-page"><section className="auth-visual"><div className="auth-orb" /><div><img src="/studentdesk-logo.png" alt="StudentDesk" className="auth-logo login-logo" /><p className="eyebrow">CAMPUS SUPPORT, SIMPLIFIED</p><h1>Help is always<br />within reach.</h1><p>Submit requests, follow progress, and connect with campus support in one friendly space.</p><div className="auth-feature"><b>✓</b> Track every support request</div><div className="auth-feature"><b>✓</b> Stay updated in real time</div></div></section><section className="auth-form-side"><form className="auth-form" onSubmit={handleLogin}><Link className="mobile-brand" to="/"><img src="/studentdesk-logo.png" alt="StudentDesk" /> StudentDesk</Link><p className="eyebrow">WELCOME BACK</p><h2>Sign in to your desk</h2><p className="form-intro">Use your student account to continue.</p><label>Username<input required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" /></label><label>Password<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label>{message && <p className="form-message error">{message}</p>}<button className="button button-primary button-wide" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button><p className="auth-switch">New to StudentDesk? <Link to="/register">Create an account</Link></p></form></section></div>;
}
export default Login;
