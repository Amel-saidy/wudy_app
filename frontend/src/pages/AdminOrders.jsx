import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  const [selectedUserMeasurements, setSelectedUserMeasurements] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchOrders();
    }
  }, [user, navigate]);

  const viewMeasurements = async (userId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get(`/api/measurements/user/${userId}`, config); // Need to add this endpoint
      setSelectedUserMeasurements(data);
      setShowModal(true);
    } catch (error) {
      alert('Measurements not found for this user.');
    }
  };

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 className="section-title" style={{ textAlign: 'left' }}>Manage Orders</h2>
      <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '20px', marginTop: '20px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '15px' }}>Order ID</th>
              <th style={{ padding: '15px' }}>Customer</th>
              <th style={{ padding: '15px' }}>Date</th>
              <th style={{ padding: '15px' }}>Total Price</th>
              <th style={{ padding: '15px' }}>Payment Method</th>
              <th style={{ padding: '15px' }}>Status</th>
              <th style={{ padding: '15px' }}>Measurements</th>
              <th style={{ padding: '15px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="8" style={{ padding: '15px', textAlign: 'center' }}>No orders found</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '15px', fontSize: '0.9rem' }}>{order._id}</td>
                  <td style={{ padding: '15px' }}>{order.user_id?.name || 'Unknown'}</td>
                  <td style={{ padding: '15px' }}>{order.createdAt.substring(0, 10)}</td>
                  <td style={{ padding: '15px' }}>D {order.total_price.toLocaleString()}</td>
                  <td style={{ padding: '15px' }}>{order.payment_method}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ padding: '5px 10px', background: 'var(--light-gray)', borderRadius: '20px', fontSize: '0.85rem' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button 
                      onClick={() => viewMeasurements(order.user_id?._id)} 
                      className="btn btn-secondary" 
                      style={{ padding: '5px 10px', fontSize: '0.8rem' }}
                    >View</button>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-main)' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Ready">Ready</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
    </div>
  );
};

export default AdminOrders;
