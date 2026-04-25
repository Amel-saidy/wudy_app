import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CustomOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    style: '',
    fabric: '',
    notes: '',
    image: ''
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasMeasurements, setHasMeasurements] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      checkMeasurements();
    }
  }, [user]);

  const checkMeasurements = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/measurements', config);
      if (!data || !data.chest) {
        setHasMeasurements(false);
      }
    } catch (err) {
      console.error('Error checking measurements:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    setUploading(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', uploadData, config);
      setFormData({ ...formData, image: data.imageUrl });
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to request a custom order.');
      return;
    }
    if (!formData.image) {
      alert('Please upload an inspiration image.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      // Final check on data
      if (!formData.style || !formData.notes || !formData.image) {
        setError('Please fill in all required fields and upload an image.');
        setSubmitting(false);
        return;
      }

      console.log('Sending request with token:', user.token ? 'Present' : 'Missing');
      
      const config = { 
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        } 
      };

      const response = await axios.post('/api/style-requests', {
        style: formData.style,
        fabric: formData.fabric,
        notes: formData.notes,
        image: formData.image
      }, config);

      if (response.status === 201 || response.status === 200) {
        setMessage('Your custom order request has been sent! Our team will review it and contact you soon with a quote.');
        setFormData({ style: '', fabric: '', notes: '', image: '' });
        setError('');
      }
    } catch (err) {
      console.error('CUSTOM_ORDER_SUBMIT_ERROR:', err);
      if (err.response) {
        // Server responded with an error
        setError(`Server Error (${err.response.status}): ${err.response.data.message || 'The server rejected the request.'}`);
      } else if (err.request) {
        // Request was made but no response was received
        setError('Network Error: The server is not responding. Please check if the backend is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <section>
        <h2 className="section-title">Request a Custom Order</h2>
        
        {message && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '4px', 
            textAlign: 'center', 
            marginBottom: '20px',
            background: 'rgba(0,255,0,0.1)',
            color: 'green',
            border: '1px solid green'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ 
            padding: '15px', 
            borderRadius: '4px', 
            textAlign: 'center', 
            marginBottom: '20px',
            background: 'rgba(255,0,0,0.1)',
            color: 'red',
            border: '1px solid red'
          }}>
            {error}
          </div>
        )}

        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Have a dream outfit in mind? Upload an inspiration image and let us bring it to life.
        </p>

        {!hasMeasurements && user && (
          <div style={{ maxWidth: '700px', margin: '0 auto 20px', background: 'rgba(255,165,0,0.1)', padding: '15px', borderRadius: '8px', border: '1px solid orange', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              <strong>Missing Measurements:</strong> You haven't saved your measurements yet. 
              Please <a href="/measurements" style={{ color: 'orange', fontWeight: 'bold' }}>click here to save them</a> so we can ensure a perfect fit!
            </p>
          </div>
        )}

        <div style={{ maxWidth: '700px', margin: '0 auto 20px', background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>📏</span>
          <p style={{ fontSize: '0.9rem', margin: 0 }}>
            <strong>Note:</strong> We will use your <a href="/measurements" style={{ color: 'var(--secondary-color)', textDecoration: 'underline' }}>saved measurements</a> for this order. 
            Make sure they are up to date!
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ maxWidth: '700px', margin: '0 auto', background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          <div className="form-group">
            <label>Upload Inspiration Image</label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '40px', textAlign: 'center', borderRadius: '4px', background: 'var(--light-gray)', position: 'relative' }}>
              {formData.image ? (
                <div style={{ position: 'relative' }}>
                  <img src={formData.image} alt="Inspiration" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, image: ''})}
                    style={{ position: 'absolute', top: 0, right: 0, background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
                  >✕</button>
                </div>
              ) : (
                <>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, opacity: 0, cursor: 'pointer' }} 
                  />
                  <p>{uploading ? 'Uploading...' : 'Click or Drag to Upload Inspiration Image'}</p>
                  <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--dark-gray)' }}>Supported formats: JPG, PNG, JPEG.</p>
                </>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label>Style Type</label>
            <select name="style" className="form-control" value={formData.style} onChange={handleChange} required>
              <option value="">Select a style...</option>
              <option value="dress">Dress</option>
              <option value="suit">Suit</option>
              <option value="traditional">Traditional Wear</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferred Fabric (Optional)</label>
            <input type="text" name="fabric" className="form-control" placeholder="e.g. Silk, Velvet, Cotton" value={formData.fabric} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Special Instructions & Notes</label>
            <textarea name="notes" className="form-control" rows="5" placeholder="e.g. I want the sleeves to be longer, or add a slit on the side..." value={formData.notes} onChange={handleChange} required></textarea>
          </div>
          
          {!user ? (
            <button type="button" onClick={() => navigate('/login')} className="btn" style={{width: '100%'}}>Login to Submit Request</button>
          ) : (
            <button type="submit" className="btn" style={{width: '100%'}} disabled={uploading || submitting}>
              {submitting ? 'Sending Request...' : 'Submit Request'}
            </button>
          )}
        </form>
      </section>
    </div>
  );
};

export default CustomOrder;
