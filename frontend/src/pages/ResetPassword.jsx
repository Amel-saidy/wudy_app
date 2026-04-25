import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { data } = await axios.put(`/api/users/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', boxShadow: 'var(--shadow)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Reset Password</h2>
        {message && <div style={{ color: 'green', marginBottom: '15px', background: '#e6ffe6', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: 'red', marginBottom: '15px', background: '#ffe6e6', padding: '10px', borderRadius: '4px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>New Password</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Set New Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
