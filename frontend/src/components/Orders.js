import React, { useState, useEffect } from 'react';
import '../styles/Orders.css';

function Orders({ currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/user/${currentUser.netid}`);
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <h2>No Orders Yet</h2>
        <p>Your order history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>My Orders</h2>
      
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.order_id} className="order-item">
            <div className="order-image">
              {order.image_id ? (
                <div className="order-image-placeholder">
                  Image ID: {order.image_id}
                </div>
              ) : (
                <div className="no-image-order">No Image</div>
              )}
            </div>

            <div className="order-details">
              <h3>{order.name}</h3>
              <p className="order-category">{order.category}</p>
              <p className="order-price">${parseFloat(order.price).toFixed(2)}</p>
            </div>

            <div className="order-info">
              <p className="order-date">
                Ordered: {new Date(order.order_date).toLocaleDateString()}
              </p>
              <p className="order-id">Order #{order.order_id}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;