import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/shop');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container">
      <section style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '60px' }}>
        <h2 className="section-title">Login</h2>
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={submitHandler} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', marginBottom: '15px' }}>Sign In</button>
          <div style={{ textAlign: 'center', marginBottom: '15px' }}>
            <Link to="/forgot-password" style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}>Forgot Password?</Link>
          </div>
          <div style={{ textAlign: 'center' }}>
            New customer? <Link to="/signup" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Register here</Link>
          </div>
        </form>
      </section>
    </div>
  );
};
export default Login;
