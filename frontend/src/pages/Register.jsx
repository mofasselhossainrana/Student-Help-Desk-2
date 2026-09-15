import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regMessage, setRegMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/register/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: regUsername,
            email: regEmail,
            password: regPassword,
          }),
        }
      );

      if (response.ok) {
        setRegMessage('Registration successful! You can now login.');

        setRegUsername('');
        setRegEmail('');
        setRegPassword('');

        navigate('/login');
      } else {
        const data = await response.json();
        setRegMessage(
          'Registration failed: ' + JSON.stringify(data)
        );
      }
    } catch (error) {
      setRegMessage('Error connecting to server.');
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Student Help Desk - Register</h1>

      <input
        type="text"
        placeholder="Username"
        value={regUsername}
        onChange={(e) => setRegUsername(e.target.value)}
      />

      <br />

      <input
        type="email"
        placeholder="Email"
        value={regEmail}
        onChange={(e) => setRegEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        value={regPassword}
        onChange={(e) => setRegPassword(e.target.value)}
      />

      <br />

      <button onClick={handleRegister}>Register</button>

      <p>{regMessage}</p>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;