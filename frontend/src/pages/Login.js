import React, { useState } from 'react';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [netid, setNetid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Create new user
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ netid, email, phone: phone || null }),
        });

        const data = await response.json();

        if (response.ok) {
          // Fetch the created user
          const userResponse = await fetch(`/api/users/${netid}`);
          const userData = await userResponse.json();
          onLogin(userData);
        } else {
          setError(data.error || 'Failed to create account');
        }
      } else {
        // Login existing user
        const response = await fetch(`/api/users/${netid}`);
        const data = await response.json();

        if (response.ok) {
          onLogin(data);
        } else {
          setError('User not found. Please sign up first.');
        }
      }
    } catch (err) {
      setError('Connection error. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>FleaCampus</h1>
        <h2>{isSignup ? 'Sign Up' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>NetID</label>
            <input
              type="text"
              value={netid}
              onChange={(e) => setNetid(e.target.value)}
              placeholder="Enter your NetID"
              required
            />
          </div>

          {isSignup && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <p className="toggle-form">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => { setIsSignup(!isSignup); setError(''); }}>
            {isSignup ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;