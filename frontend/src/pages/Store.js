import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import ProductDetail from '../components/ProductDetail';
import Cart from '../components/Cart';
import Orders from '../components/Orders';
import AddProduct from '../components/AddProduct';
import '../styles/Store.css';

function Store({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = localStorage.getItem('fleacampus_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product_id === product.product_id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    setCart(newCart);
    localStorage.setItem('fleacampus_cart', JSON.stringify(newCart));
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.product_id !== productId);
    setCart(newCart);
    localStorage.setItem('fleacampus_cart', JSON.stringify(newCart));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const newCart = cart.map(item =>
      item.product_id === productId ? { ...item, quantity } : item
    );
    setCart(newCart);
    localStorage.setItem('fleacampus_cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('fleacampus_cart');
  };

  const handleProductAdded = () => {
    fetchProducts();
    setActiveTab('products');
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  return (
    <div className="store-container">
      <header className="store-header">
        <div className="header-content">
          <h1>FleaCampus Marketplace</h1>
          <div className="header-right">
            <span className="user-info">Welcome, {user.netid}</span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </div>
        
        <nav className="store-nav">
          <button 
            className={activeTab === 'products' ? 'active' : ''} 
            onClick={() => { setActiveTab('products'); setSelectedProduct(null); }}
          >
            Products
          </button>
          <button 
            className={activeTab === 'cart' ? 'active' : ''} 
            onClick={() => setActiveTab('cart')}
          >
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </button>
          <button 
            className={activeTab === 'orders' ? 'active' : ''} 
            onClick={() => setActiveTab('orders')}
          >
            My Orders
          </button>
          <button 
            className={activeTab === 'sell' ? 'active' : ''} 
            onClick={() => setActiveTab('sell')}
          >
            Sell Item
          </button>
        </nav>
      </header>

      <main className="store-main">
        {activeTab === 'products' && !selectedProduct && (
          <>
            <div className="filter-section">
              <label>Filter by Category:</label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <ProductList 
              products={filteredProducts} 
              loading={loading}
              onProductClick={setSelectedProduct}
              onAddToCart={addToCart}
            />
          </>
        )}

        {activeTab === 'products' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={addToCart}
            currentUser={user}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            cart={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            currentUser={user}
          />
        )}

        {activeTab === 'orders' && (
          <Orders currentUser={user} />
        )}

        {activeTab === 'sell' && (
          <AddProduct 
            currentUser={user} 
            onProductAdded={handleProductAdded}
          />
        )}
      </main>
    </div>
  );
}

export default Store;