import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(
        'https://student-help-desk-2.onrender.com/api/register/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          `Registration failed: ${Object.values(data).flat().join(' ')}`
        );
      }

      navigate('/login');
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
          <img
            src="/studentdesk-logo.png"
            alt="StudentDesk"
            className="auth-logo"
          />

          <p className="eyebrow">STUDENTDESK PORTAL</p>

          <h1>
            Your support
            <br />
            starts here.
          </h1>

          <p>
            Create an account to reach Central IT and academic support whenever
            you need it.
          </p>
        </div>
      </section>

      <section className="auth-form-side">
        <form className="auth-form" onSubmit={handleRegister}>
          <Link className="mobile-brand" to="/">
            <img src="/studentdesk-logo.png" alt="StudentDesk" /> StudentDesk
          </Link>

          <p className="eyebrow">CREATE ACCOUNT</p>

          <h2>Join StudentDesk</h2>

          <p className="form-intro">
            Your campus help desk in one place.
          </p>

          <label>
            Username
            <input
              required
              value={form.username}
              onChange={update('username')}
              placeholder="Choose a username"
            />
          </label>

          <label>
            University email
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@university.edu"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="Create a password"
            />
          </label>

          {message && <p className="form-message error">{message}</p>}

          <button
            className="button button-primary button-wide"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;

