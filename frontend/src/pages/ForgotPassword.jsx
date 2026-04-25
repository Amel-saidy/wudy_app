import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await axios.post('/api/users/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', boxShadow: 'var(--shadow)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Forgot Password</h2>
        {message && <div style={{ color: 'green', marginBottom: '15px', background: '#e6ffe6', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '15px', background: '#ffe6e6', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Send Reset Link</button>
        </form>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: 'var(--primary-color)' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
