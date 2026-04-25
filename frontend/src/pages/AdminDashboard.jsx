import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchOrders();
      fetchRequests();
    }
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRequests = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/style-requests/all', config);
      setRequests(data.slice(0, 5)); // Show only latest 5
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <section style={{ padding: '40px 0' }}>
        <h2 className="section-title" style={{ textAlign: 'left' }}>Admin Dashboard</h2>
        <div className="responsive-flex" style={{ marginBottom: '40px' }}>
          <div style={{ flex: 1, background: 'var(--primary-color)', color: 'var(--bg-main)', padding: '30px', borderRadius: '8px' }}>
            <h3>Manage Products</h3>
            <p>Add, edit, or remove store products.</p>
            <Link to="/admin/products" className="btn btn-secondary" style={{ marginTop: '15px', borderColor: 'var(--bg-main)', color: 'var(--bg-main)' }}>Go to Products</Link>
          </div>
          <div style={{ flex: 1, background: 'var(--secondary-color)', color: 'var(--bg-main)', padding: '30px', borderRadius: '8px' }}>
            <h3>Manage Orders</h3>
            <p>View customer orders and measurements.</p>
            <Link to="/admin/orders" className="btn btn-secondary" style={{ marginTop: '15px', borderColor: 'var(--bg-main)', color: 'var(--bg-main)' }}>Go to Orders</Link>
          </div>
          <div style={{ flex: 1, background: 'var(--accent-color)', color: 'var(--bg-main)', padding: '30px', borderRadius: '8px' }}>
            <h3>Custom Requests</h3>
            <p>Inspiration images and style inquiries.</p>
            <Link to="/admin/custom-requests" className="btn btn-secondary" style={{ marginTop: '15px', borderColor: 'var(--bg-main)', color: 'var(--bg-main)' }}>Go to Requests</Link>
          </div>
        </div>

        <div className="responsive-flex" style={{ marginTop: '40px', gap: '30px' }}>
          <div style={{ flex: 1 }}>
            <h3>Recent Orders</h3>
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '20px', marginTop: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '15px' }}>User</th>
                    <th style={{ padding: '15px' }}>Date</th>
                    <th style={{ padding: '15px' }}>Total</th>
                    <th style={{ padding: '15px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan="4" style={{ padding: '15px', textAlign: 'center' }}>No orders found</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '15px' }}>{order.user_id?.name}</td>
                        <td style={{ padding: '15px' }}>{order.createdAt.substring(0, 10)}</td>
                        <td style={{ padding: '15px' }}>D {order.total_price}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ padding: '5px 10px', background: 'var(--light-gray)', borderRadius: '20px', fontSize: '0.85rem' }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Link to="/admin/orders" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: 'var(--secondary-color)' }}>View All Orders</Link>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Recent Custom Requests</h3>
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '20px', marginTop: '20px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ padding: '15px' }}>User</th>
                    <th style={{ padding: '15px' }}>Style</th>
                    <th style={{ padding: '15px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="3" style={{ padding: '15px', textAlign: 'center' }}>No requests found</td></tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '15px' }}>{req.user_id?.name}</td>
                        <td style={{ padding: '15px', textTransform: 'capitalize' }}>{req.style}</td>
                        <td style={{ padding: '15px' }}>
                          <span style={{ padding: '5px 10px', background: 'var(--light-gray)', borderRadius: '20px', fontSize: '0.85rem' }}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <Link to="/admin/custom-requests" style={{ display: 'block', textAlign: 'center', marginTop: '15px', color: 'var(--secondary-color)' }}>View All Requests</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AdminDashboard;
