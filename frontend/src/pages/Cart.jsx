import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getImageUrl } from '../utils/imageUrl';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container">
      <section>
        <h2 className="section-title">Your Cart</h2>
        
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Your cart is currently empty.</p>
            <Link to="/shop" className="btn" style={{ marginTop: '20px' }}>Continue Shopping</Link>
          </div>
        ) : (
          <div className="responsive-flex">
            <div style={{ flex: 2 }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '30px' }}>
                {cartItems.map((item) => (
                  <div key={item.cartId} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                      <img src={getImageUrl(item.image)} alt="Item" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h4>
                        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>Color: {item.colorName}</p>
                        <p style={{ color: 'var(--dark-gray)', fontSize: '0.9rem' }}>Type: {item.orderType === 'custom' ? 'Custom Tailored' : 'Standard Size'}</p>
                        {item.orderType === 'custom' && (
                          <Link to="/measurements" style={{ color: 'var(--secondary-color)', fontSize: '0.9rem', textDecoration: 'underline' }}>Edit Measurements</Link>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>D {item.price.toLocaleString()}</div>
                      <button onClick={() => removeFromCart(item.cartId)} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '8px', boxShadow: 'var(--shadow)', padding: '30px', position: 'sticky', top: '100px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Order Summary</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>D {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  <span>Total</span>
                  <span>D {subtotal.toLocaleString()}</span>
                </div>
                <Link to="/checkout" className="btn" style={{ width: '100%', display: 'block', textAlign: 'center' }}>Proceed to Checkout</Link>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Cart;
