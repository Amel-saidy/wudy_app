import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [orderType, setOrderType] = useState('standard');

  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
          setMainImage(data.colors[0].image);
        } else if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch product');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setMainImage(color.image);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedColor, orderType);
    navigate('/cart');
  };

  if (loading) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Loading...</div>;
  if (error) return <div className="container" style={{ textAlign: 'center', color: 'red', padding: '100px' }}>{error}</div>;
  if (!product) return <div className="container" style={{ textAlign: 'center', padding: '100px' }}>Product not found.</div>;

  return (
    <div className="container">
      <section className="responsive-flex" style={{ marginTop: '40px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ height: '600px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', background: 'var(--light-gray)' }}>
            {mainImage && <img src={mainImage} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* Show color variant thumbnails if colors exist, otherwise show regular images */}
            {product.colors && product.colors.length > 0 ? (
              product.colors.map((color, index) => (
                <img 
                  key={index} 
                  src={color.image} 
                  alt={`${product.name} - ${color.name}`} 
                  onClick={() => handleColorSelect(color)}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px', border: selectedColor?.name === color.name ? '2px solid var(--secondary-color)' : 'none' }}
                />
              ))
            ) : product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Thumbnail ${index}`} 
                  onClick={() => setMainImage(img)}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px', border: mainImage === img ? '2px solid var(--secondary-color)' : 'none' }}
                />
              ))
            ) : null}
          </div>
        </div>
        
        <div style={{ flex: 1, padding: '20px 0' }}>
          {product.is_customizable && <span className="product-badge" style={{position: 'static', display: 'inline-block', marginBottom: '15px'}}>Customizable</span>}
          <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{product.name}</h1>
          <div className="product-price" style={{ fontSize: '1.8rem', marginBottom: '25px' }}>D {product.price.toLocaleString()}</div>
          
          <p style={{ fontSize: '1.1rem', color: 'var(--dark-gray)', marginBottom: '30px' }}>{product.description}</p>
          
          <div style={{ marginBottom: '20px' }}>
            <strong>Category:</strong> <span style={{ textTransform: 'capitalize' }}>{product.category}</span>
          </div>

          {product.colors && product.colors.length > 0 && selectedColor && (
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label>Select Color / Variant: <span style={{fontWeight: 'normal', color: 'var(--dark-gray)'}}>{selectedColor.name}</span></label>
              <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorSelect(color)}
                    style={{
                      padding: '8px 16px',
                      border: selectedColor.name === color.name ? '2px solid var(--primary-color)' : '1px solid #ddd',
                      background: selectedColor.name === color.name ? 'var(--primary-color)' : 'transparent',
                      color: selectedColor.name === color.name ? 'white' : 'inherit',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '40px' }}>
            <label>Order Options:</label>
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal', cursor: 'pointer' }}>
                <input type="radio" name="orderType" value="standard" checked={orderType === 'standard'} onChange={() => setOrderType('standard')} />
                Standard Size (Ready-made)
              </label>
              {product.is_customizable && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'normal', cursor: 'pointer' }}>
                  <input type="radio" name="orderType" value="custom" checked={orderType === 'custom'} onChange={() => setOrderType('custom')} />
                  Custom Tailored (Use my measurements)
                </label>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px' }}>
            <button onClick={handleAddToCart} className="btn" style={{ flex: 1 }}>Add to Cart</button>
            <button onClick={handleAddToCart} className="btn btn-secondary" style={{ flex: 1 }}>Buy Now</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
