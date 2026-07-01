import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { OrdersPage, OrderDetailPage } from './pages/OrderPages';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/checkout" element={
                  <ProtectedRoute><CheckoutPage /></ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute><OrdersPage /></ProtectedRoute>
                } />
                <Route path="/orders/:id" element={
                  <ProtectedRoute><OrderDetailPage /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute><ProfilePage /></ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <AdminRoute><AdminPage /></AdminRoute>
                } />
                <Route path="*" element={
                  <div className="empty-state" style={{ paddingTop: '100px' }}>
                    <span className="icon">🔍</span>
                    <h3>404 - Page Not Found</h3>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go Home</a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop theme="colored" />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;