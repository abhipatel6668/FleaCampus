import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Store from './pages/Store';
import './styles/App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('fleacampus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('fleacampus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fleacampus_user');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/store" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/store" 
            element={user ? <Store user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/" 
            element={<Navigate to={user ? "/store" : "/login"} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;