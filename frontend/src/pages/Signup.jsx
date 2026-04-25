import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password);
    if (res.success) {
      navigate('/shop');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="container">
      <section style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '60px' }}>
        <h2 className="section-title">Create Account</h2>
        {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={submitHandler} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>Sign Up</button>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--secondary-color)', fontWeight: 'bold' }}>Login</Link>
          </div>
        </form>
      </section>
    </div>
  );
};
export default Signup;
