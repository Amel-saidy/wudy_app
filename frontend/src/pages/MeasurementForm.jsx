import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MeasurementForm = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    chest: '',
    waist: '',
    hips: '',
    shoulder: '',
    length: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyMeasurements();
    }
  }, [user]);

  const fetchMyMeasurements = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/measurements', config);
      if (data && data.chest) {
        setFormData({
          chest: data.chest,
          waist: data.waist,
          hips: data.hips,
          shoulder: data.shoulder,
          length: data.length
        });
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please login to save your measurements.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/measurements', formData, config);
      setMessage('Measurements saved successfully!');
    } catch (err) {
      setMessage('Error saving measurements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <section>
        <h2 className="section-title">Your Measurements</h2>
        
        {message && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '4px', 
            textAlign: 'center', 
            marginBottom: '20px',
            background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)',
            color: message.includes('Error') ? 'red' : 'green',
            border: `1px solid ${message.includes('Error') ? 'red' : 'green'}`
          }}>
            {message}
          </div>
        )}

        <div className="measurement-guide">
          <div className="guide-text">
            <h3>How to Measure Correctly</h3>
            <p>For the best fit, please follow these instructions carefully or have someone assist you with a flexible measuring tape.</p>
            <ul>
              <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping tape straight across the back.</li>
              <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
              <li><strong>Hips:</strong> Stand with heels together and measure around the fullest part of your hips.</li>
              <li><strong>Shoulder:</strong> Measure from the edge of one shoulder to the edge of the other.</li>
              <li><strong>Length:</strong> Measure from the highest point of your shoulder down to the desired hemline.</li>
            </ul>
          </div>
          <div className="guide-image">
            <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Tailor measuring guide" style={{maxHeight: '400px', objectFit: 'cover'}}/>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <div className="form-group">
            <label>Chest (inches/cm)</label>
            <input type="number" name="chest" className="form-control" value={formData.chest} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Waist (inches/cm)</label>
            <input type="number" name="waist" className="form-control" value={formData.waist} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Hips (inches/cm)</label>
            <input type="number" name="hips" className="form-control" value={formData.hips} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Shoulder Width (inches/cm)</label>
            <input type="number" name="shoulder" className="form-control" value={formData.shoulder} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Desired Length (inches/cm)</label>
            <input type="number" name="length" className="form-control" value={formData.length} onChange={handleChange} required />
          </div>
          
          <button type="submit" className="btn" style={{width: '100%'}} disabled={loading}>
            {loading ? 'Saving...' : 'Save Measurements'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default MeasurementForm;
