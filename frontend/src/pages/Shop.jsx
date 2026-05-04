import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getImageUrl } from '../utils/imageUrl';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="shop-page">
      <section className="container">
        <h2 className="section-title">Our Collection</h2>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: 'red', padding: '50px' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>No products found in the database. Add some from the Admin Dashboard!</div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                {product.is_customizable && <span className="product-badge">Customizable</span>}
                <div className="product-image">
                  <img src={getImageUrl(product.images && product.images[0] ? product.images[0] : (product.colors && product.colors[0] ? product.colors[0].image : ''))} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-price">D {product.price.toLocaleString()}</div>
                  <button className="btn">View Details</button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Shop;
