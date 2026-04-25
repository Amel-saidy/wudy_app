import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingPrice = 200;
  const totalPrice = subtotal + shippingPrice;

  const placeOrder = async () => {
    if (!paymentMethod || !address || !city || !phone) {
      setError('Please fill in all shipping details and select a payment method.');
      return;
    }

    if (!user) {
      setError('You must be logged in to place an order.');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        custom_notes: `Color: ${item.colorName}, Type: ${item.orderType}`
      }));

      await axios.post('/api/orders', {
        orderItems,
        shipping_address: `${address}, ${city} - Phone: ${phone}`,
        payment_method: paymentMethod,
        total_price: totalPrice
      }, config);

      setSuccess(true);
      clearCart();
      setTimeout(() => {
        navigate('/shop');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (success) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: 'green', marginBottom: '20px' }}>Order Placed Successfully!</h2>
        <p>Thank you for shopping with Wudy Tailoring.</p>
        <p>You will be redirected to the shop shortly.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="btn" style={{ marginTop: '20px' }}>Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="container">
      <section>
        <h2 className="section-title">Checkout</h2>
        {error && <div style={{ color: 'red', marginBottom: '20px', textAlign: 'center', background: 'rgba(255, 0, 0, 0.1)', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,0,0,0.2)' }}>{error}</div>}
        <div className="responsive-flex">
          <div style={{ flex: 2 }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '30px', marginBottom: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>1. Shipping Details</h3>
              <div className="form-group">
                <label>Address</label>
                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="responsive-flex" style={{ gap: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>City</label>
                  <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Phone Number (WhatsApp preferred)</label>
                  <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>2. Payment Method</h3>
              <p style={{ marginBottom: '20px', color: 'var(--dark-gray)' }}>Please select your preferred Mobile Money provider.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: paymentMethod === 'Wave' ? 'var(--light-gray)' : 'transparent' }}>
                  <input type="radio" name="payment" value="Wave" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ fontWeight: 'bold' }}>Wave</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: paymentMethod === 'Q money' ? 'var(--light-gray)' : 'transparent' }}>
                  <input type="radio" name="payment" value="Q money" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ fontWeight: 'bold' }}>Q Money</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: paymentMethod === 'Afri money' ? 'var(--light-gray)' : 'transparent' }}>
                  <input type="radio" name="payment" value="Afri money" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ fontWeight: 'bold' }}>Afri Money</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: paymentMethod === 'APS' ? 'var(--light-gray)' : 'transparent' }}>
                  <input type="radio" name="payment" value="APS" onChange={(e) => setPaymentMethod(e.target.value)} />
                  <span style={{ fontWeight: 'bold' }}>APS</span>
                </label>
              </div>

              {paymentMethod && (
                <div style={{ marginTop: '20px', padding: '20px', background: 'var(--bg-input)', borderRadius: '4px', borderLeft: '4px solid var(--secondary-color)', color: 'var(--text-main)' }}>
                  <p>Please send your payment to our {paymentMethod.toUpperCase()} number: <strong>+220 123 4567</strong>.</p>
                  <p style={{ marginTop: '10px' }}>Once sent, your order will be verified and processed.</p>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ flex: 1 }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '30px', position: 'sticky', top: '100px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '0.9rem' }}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>D {item.price.toLocaleString()}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                <span>Shipping</span>
                <span>D {shippingPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                <span>Total</span>
                <span>D {totalPrice.toLocaleString()}</span>
              </div>
              <button onClick={placeOrder} className="btn" style={{ width: '100%' }}>Place Order</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
