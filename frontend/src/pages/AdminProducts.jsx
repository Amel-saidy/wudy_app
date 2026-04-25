import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [colors, setColors] = useState([{ name: '', image: '' }]);
  const [editingId, setEditingId] = useState(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  const addColorField = () => {
    setColors([...colors, { name: '', image: '' }]);
  };

  const uploadFileHandler = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingIndex(index);

    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/upload', formData, config);
      handleColorChange(index, 'image', data.imageUrl);
      setUploadingIndex(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadingIndex(null);
      alert('Error uploading image. Make sure Cloudinary is configured properly in .env');
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const editHandler = (product) => {
    setEditingId(product._id);
    setName(product.name);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setIsCustomizable(product.is_customizable);
    setColors(product.colors && product.colors.length > 0 ? product.colors : [{ name: '', image: '' }]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(''); setPrice(''); setDescription(''); setCategory(''); setIsCustomizable(false); setColors([{ name: '', image: '' }]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const productData = {
        name,
        price,
        description,
        category,
        is_customizable: isCustomizable,
        colors,
        images: [] 
      };

      if (editingId) {
        await axios.put(`/api/products/${editingId}`, productData, config);
      } else {
        await axios.post('/api/products', productData, config);
      }
      
      fetchProducts(); // refresh
      cancelEdit(); // reset form
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h2 className="section-title">Manage Products</h2>
      
      <div className="responsive-flex">
        <div style={{ flex: 1 }}>
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={submitHandler} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Price (D)</label>
              <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={isCustomizable} onChange={(e) => setIsCustomizable(e.target.checked)} />
                Is Customizable (Requires Measurements)
              </label>
            </div>
            
            <h4>Variants / Colors</h4>
            {colors.map((color, index) => (
              <div key={index} style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '4px', marginBottom: '15px', background: 'var(--bg-main)' }}>
                <div className="form-group">
                  <label>Variant Name</label>
                  <input type="text" className="form-control" placeholder="e.g. Emerald Green" value={color.name} onChange={(e) => handleColorChange(index, 'name', e.target.value)} required />
                </div>
                
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Image URL (Paste URL or Upload File)</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input type="text" className="form-control" placeholder="https://..." value={color.image} onChange={(e) => handleColorChange(index, 'image', e.target.value)} required style={{ flex: 1, minWidth: '200px' }} />
                    
                    <span style={{ fontWeight: 'bold' }}>OR</span>
                    
                    <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0, padding: '10px 15px', whiteSpace: 'nowrap' }}>
                      {uploadingIndex === index ? 'Uploading...' : 'Upload Image / Camera'}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => uploadFileHandler(e, index)}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>
                </div>

                {color.image && (
                  <div style={{ marginTop: '10px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--dark-gray)', marginBottom: '5px' }}>Preview:</p>
                    <img src={color.image} alt={color.name || 'Preview'} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                  </div>
                )}
              </div>
            ))}
            <button type="button" onClick={addColorField} className="btn btn-secondary" style={{ marginBottom: '20px', padding: '8px 16px' }}>+ Add Another Variant</button>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn" style={{ flex: 1 }}>{editingId ? 'Update Product' : 'Create Product'}</button>
              {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>}
            </div>
          </form>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Current Products</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {products.map(p => (
              <div key={p._id} style={{ background: 'var(--bg-card)', padding: '15px', borderRadius: '8px', boxShadow: 'var(--shadow)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{p.name}</strong> - D {p.price}
                  <div style={{ fontSize: '0.85rem', color: 'var(--dark-gray)' }}>{p.colors?.length || 0} variants</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => editHandler(p)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Edit</button>
                  <button onClick={() => deleteHandler(p._id)} className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', color: 'red', borderColor: 'red' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminProducts;
