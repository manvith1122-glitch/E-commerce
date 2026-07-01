import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div className="container">
      <div style={styles.grid}>
        <div>
          <div style={styles.logo}>🛍️ ShopElite</div>
          <p style={styles.tagline}>Your premium shopping destination. Discover thousands of products with unbeatable prices.</p>
        </div>
        <div>
          <h4 style={styles.colTitle}>Shop</h4>
          {['Electronics', 'Clothing', 'Books', 'Sports', 'Beauty'].map(c => (
            <Link key={c} to={`/products?category=${c}`} style={styles.link}>{c}</Link>
          ))}
        </div>
        <div>
          <h4 style={styles.colTitle}>Account</h4>
          {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Cart', '/cart'], ['Login', '/login']].map(([label, href]) => (
            <Link key={label} to={href} style={styles.link}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={styles.colTitle}>Support</h4>
          <p style={styles.info}>📧 support@shopelite.com</p>
          <p style={styles.info}>📞 +91 98765 43210</p>
          <p style={styles.info}>🕐 Mon–Sat 9AM–6PM</p>
          <div style={styles.badges}>
            <span style={styles.badge}>🔒 Secure</span>
            <span style={styles.badge}>🚚 Fast Delivery</span>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} ShopElite. All rights reserved.</p>
        <p style={{ color: '#555' }}>Built with React + Node.js + MongoDB</p>
      </div>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#0d0d1a', color: '#ccc', padding: '60px 0 24px', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' },
  logo: { fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '12px' },
  tagline: { fontSize: '13px', color: '#666', lineHeight: '1.7', maxWidth: '240px' },
  colTitle: { color: '#fff', fontWeight: '700', marginBottom: '14px', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' },
  link: { display: 'block', color: '#888', fontSize: '14px', marginBottom: '8px', transition: 'color 0.2s' },
  info: { color: '#888', fontSize: '13px', marginBottom: '8px' },
  badges: { display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' },
  badge: { background: 'rgba(255,255,255,0.07)', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#aaa' },
  bottom: {
    borderTop: '1px solid #1e1e2e', paddingTop: '24px',
    display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
    fontSize: '13px', color: '#555',
  },
};

export default Footer;