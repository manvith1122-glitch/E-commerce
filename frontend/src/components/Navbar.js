import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropOpen(false);
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🛍️</span>
          <span>ShopElite</span>
        </Link>

        <div style={styles.navLinks}>
          <Link to="/products" style={styles.navLink}>Products</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ ...styles.navLink, color: '#f5a623' }}>Admin</Link>
          )}
        </div>

        <div style={styles.actions}>
          <Link to="/cart" style={styles.cartBtn}>
            <span>🛒</span>
            {totalItems > 0 && <span style={styles.cartBadge}>{totalItems}</span>}
          </Link>

          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                style={styles.userBtn}
                onClick={() => setDropOpen(!dropOpen)}
              >
                <span style={styles.avatar}>{user.name[0].toUpperCase()}</span>
                <span style={styles.userName}>{user.name.split(' ')[0]}</span>
                <span>▾</span>
              </button>
              {dropOpen && (
                <div style={styles.dropdown}>
                  <Link to="/profile" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    👤 My Profile
                  </Link>
                  <Link to="/orders" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                    📦 My Orders
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" style={styles.dropItem} onClick={() => setDropOpen(false)}>
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #eee' }} />
                  <button style={{ ...styles.dropItem, width: '100%', textAlign: 'left', background: 'none', border: 'none', color: '#e74c3c' }} onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    background: '#1a1a2e',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#fff',
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '-0.5px',
  },
  logoIcon: { fontSize: '28px' },
  navLinks: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  cartBtn: {
    position: 'relative',
    color: '#fff',
    fontSize: '24px',
    lineHeight: 1,
  },
  cartBadge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    background: '#e94560',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    padding: '6px 12px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    background: '#e94560',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  userName: { fontWeight: '600' },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    minWidth: '200px',
    overflow: 'hidden',
    padding: '6px',
  },
  dropItem: {
    display: 'block',
    padding: '10px 14px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#1a1a2e',
    borderRadius: '8px',
    transition: 'background 0.2s',
    cursor: 'pointer',
  },
};

export default Navbar;