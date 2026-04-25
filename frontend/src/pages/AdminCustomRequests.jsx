import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AdminCustomRequests = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [selectedUserMeasurements, setSelectedUserMeasurements] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchRequests();
    }
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/style-requests/all', config);
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  };

  const viewMeasurements = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/measurements/user/${userId}`, config);
      setSelectedUserMeasurements(data);
      setShowModal(true);
    } catch (error) {
      alert('Measurements not found for this user.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/style-requests/${id}/status`, { status }, config); 
      fetchRequests();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 className="section-title" style={{ textAlign: 'left' }}>Custom Order Requests</h2>
      <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '20px', marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Style</th>
              <th style={{ padding: '15px' }}>Image</th>
              <th style={{ padding: '15px' }}>Notes</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Measurements</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '15px', textAlign: 'center' }}>No custom requests found</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '15px' }}>{req.createdAt.substring(0, 10)}</td>
                  <td style={{ padding: '15px' }}>{req.user_id?.name || 'Unknown'}</td>
                  <td style={{ padding: '15px', textTransform: 'capitalize' }}>{req.style}</td>
                  <td style={{ padding: '15px' }}>
                    <a href={req.image} target="_blank" rel="noopener noreferrer">
                      <img src={req.image} alt="Inspiration" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    </a>
                  </td>
                  <td style={{ padding: '15px', fontSize: '0.9rem', maxWidth: '300px' }}>{req.notes}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ 
                      padding: '5px 10px', 
                      background: 'var(--light-gray)', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem' 
                    }}>{req.status}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button 
                      onClick={() => viewMeasurements(req.user_id?._id)} 
                      className="btn btn-secondary" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    >View</button>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select 
                      value={req.status} 
                      onChange={(e) => updateStatus(req._id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Quote Sent">Quote Sent</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showModal && selectedUserMeasurements && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '8px', maxWidth: '400px', width: '90%' }}>
            <h3>Customer Measurements</h3>
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p><strong>Chest:</strong> {selectedUserMeasurements.chest}</p>
              <p><strong>Waist:</strong> {selectedUserMeasurements.waist}</p>
              <p><strong>Hips:</strong> {selectedUserMeasurements.hips}</p>
              <p><strong>Shoulder:</strong> {selectedUserMeasurements.shoulder}</p>
              <p><strong>Length:</strong> {selectedUserMeasurements.length}</p>
            </div>
            <button onClick={() => setShowModal(false)} className="btn" style={{ width: '100%', marginTop: '30px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomRequests;
