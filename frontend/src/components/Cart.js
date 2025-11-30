import React, { useState } from 'react';
import '../styles/Cart.css';

function Cart({ cart, onUpdateQuantity, onRemoveItem, onClearCart, currentUser }) {
  const [ordering, setOrdering] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    setOrdering(true);
    setOrderStatus('');

    try {
      // Create orders for each item in cart
      const orderPromises = cart.map(item =>
        fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: currentUser.netid,
            product_id: item.product_id,
          }),
        })
      );

      const results = await Promise.all(orderPromises);
      const allSuccess = results.every(r => r.ok);

      if (allSuccess) {
        setOrderStatus('Orders placed successfully!');
        setTimeout(() => {
          onClearCart();
          setOrderStatus('');
        }, 2000);
      } else {
        setOrderStatus('Some orders failed. Please try again.');
      }
    } catch (err) {
      setOrderStatus('Connection error. Please try again.');
    } finally {
      setOrdering(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <p>Add some items to get started!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <button className="btn-clear" onClick={onClearCart}>Clear Cart</button>
      </div>

      <div className="cart-items">
        {cart.map(item => (
          <div key={item.product_id} className="cart-item">
            <div className="cart-item-image">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} />
              ) : (
                <div className="no-image-cart">No Image</div>
              )}
            </div>

            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="cart-item-category">{item.category}</p>
              <p className="cart-item-vendor">Seller: {item.vendor_netid}</p>
            </div>

            <div className="cart-item-quantity">
              <button 
                onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <div className="cart-item-price">
              ${(item.price * item.quantity).toFixed(2)}
            </div>

            <button 
              className="btn-remove" 
              onClick={() => onRemoveItem(item.product_id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <span className="total-amount">${total.toFixed(2)}</span>
        </div>
        
        {orderStatus && (
          <div className={`order-status ${orderStatus.includes('success') ? 'success' : 'error'}`}>
            {orderStatus}
          </div>
        )}
        
        <button 
          className="btn-checkout" 
          onClick={handleCheckout}
          disabled={ordering}
        >
          {ordering ? 'Processing...' : 'Checkout'}
        </button>
      </div>
    </div>
  );
}

export default Cart;