import React, { useState } from 'react';
import '../styles/AddProduct.css';

function AddProduct({ currentUser, onProductAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('furniture');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = ['furniture', 'technology', 'clothes', 'appliances'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendor_netid: currentUser.netid,
          name,
          price: parseFloat(price),
          category,
          image_url: imageUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Product added successfully!');
        setName('');
        setPrice('');
        setCategory('furniture');
        setImageUrl('');
        
        setTimeout(() => {
          onProductAdded();
        }, 1500);
      } else {
        setError(data.error || 'Failed to add product');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>Sell an Item</h2>
      
      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
          />
        </div>

        <div className="form-group">
          <label>Price ($) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" className="btn-submit-product" disabled={submitting}>
          {submitting ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}

export default AddProduct;