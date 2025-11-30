import React from 'react';
import '../styles/ProductList.css';

function ProductList({ products, loading, onProductClick, onAddToCart }) {
  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products available.</div>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.product_id} className="product-card">
          <div 
            className="product-image-container" 
            onClick={() => onProductClick(product)}
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} />
            ) : (
              <div className="no-image">No Image</div>
            )}
          </div>
          
          <div className="product-info">
            <h3 onClick={() => onProductClick(product)}>{product.name}</h3>
            <p className="product-category">{product.category}</p>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-vendor">Sold by: {product.vendor_netid}</p>
            <button 
              className="btn-add-cart" 
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;