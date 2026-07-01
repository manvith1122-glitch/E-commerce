import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Clothing', icon: '👕' },
  { name: 'Books', icon: '📚' },
  { name: 'Home & Garden', icon: '🏠' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Food', icon: '🍕' },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, newest] = await Promise.all([
          productAPI.getAll({ featured: true, limit: 4 }),
          productAPI.getAll({ sort: 'newest', limit: 8 }),
        ]);
        setFeaturedProducts(featured.data.products);
        setNewArrivals(newest.data.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroText}>
            <p style={styles.heroEyebrow}>New Season Collection</p>
            <h1 style={styles.heroTitle}>Shop the Future,<br />Delivered Today</h1>
            <p style={styles.heroSub}>Discover thousands of products with unbeatable prices, fast delivery, and a seamless shopping experience.</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '32px' }}>
              <Link to="/products" className="btn btn-primary btn-lg">Shop Now →</Link>
              <Link to="/products?featured=true" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}>
                View Featured
              </Link>
            </div>
            <div style={styles.heroStats}>
              {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.9★', 'Rating']].map(([num, label]) => (
                <div key={label} style={styles.statItem}>
                  <span style={styles.statNum}>{num}</span>
                  <span style={styles.statLabel}>{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.heroVisual}>
            <div style={styles.heroCard}>
              <div style={styles.heroCardInner}>
                <span style={{ fontSize: '80px' }}>🛍️</span>
                <div style={{ marginTop: '16px' }}>
                  <div style={styles.heroPill}>✓ Free Shipping over ₹500</div>
                  <div style={styles.heroPill}>✓ 30-Day Returns</div>
                  <div style={styles.heroPill}>✓ 24/7 Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="page-header">
            <h2>Shop by Category</h2>
            <p>Find exactly what you're looking for</p>
          </div>
          <div style={styles.categoriesGrid}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`} style={styles.catCard}>
                <span style={styles.catIcon}>{cat.icon}</span>
                <span style={styles.catName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredProducts.length > 0 && (
        <section style={{ padding: '20px 0 60px', background: '#f8f9fa' }}>
          <div className="container">
            <div className="flex-between mb-24">
              <div className="page-header" style={{ marginBottom: 0 }}>
                <h2>⭐ Featured Products</h2>
              </div>
              <Link to="/products?featured=true" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="grid products-grid">
              {featuredProducts.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="flex-between mb-24">
            <div className="page-header" style={{ marginBottom: 0 }}>
              <h2>🆕 New Arrivals</h2>
            </div>
            <Link to="/products?sort=newest" className="btn btn-outline btn-sm">View All</Link>
          </div>
          {loading ? (
            <div className="loading-spinner"><div className="spinner" /></div>
          ) : (
            <div className="grid products-grid">
              {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section style={styles.banner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', color: '#fff', marginBottom: '12px' }}>🚀 Free Shipping on Orders Over ₹500</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '24px', fontSize: '16px' }}>Use code FIRST10 for 10% off your first order</p>
          <Link to="/products" className="btn" style={{ background: '#fff', color: '#e94560', fontSize: '16px', padding: '12px 32px' }}>
            Start Shopping
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    padding: '80px 0',
    minHeight: '500px',
  },
  heroContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '60px',
    flexWrap: 'wrap',
  },
  heroText: { flex: '1', minWidth: '300px' },
  heroEyebrow: {
    color: '#e94560',
    fontWeight: '600',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '16px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: '800',
    color: '#fff',
    lineHeight: '1.1',
    letterSpacing: '-1px',
  },
  heroSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '17px',
    lineHeight: '1.7',
    marginTop: '20px',
    maxWidth: '480px',
  },
  heroStats: {
    display: 'flex',
    gap: '40px',
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  statItem: { display: 'flex', flexDirection: 'column' },
  statNum: { fontSize: '26px', fontWeight: '800', color: '#fff' },
  statLabel: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' },
  heroVisual: { flex: '0 0 auto' },
  heroCard: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '24px',
    padding: '40px',
    backdropFilter: 'blur(10px)',
  },
  heroCardInner: { textAlign: 'center' },
  heroPill: {
    background: 'rgba(255,255,255,0.1)',
    color: 'rgba(255,255,255,0.9)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    marginTop: '10px',
    fontWeight: '500',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '16px',
  },
  catCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '24px 12px',
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    border: '2px solid transparent',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  catIcon: { fontSize: '36px' },
  catName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a2e',
    textAlign: 'center',
  },
  banner: {
    background: 'linear-gradient(135deg, #e94560, #c73652)',
    padding: '60px 0',
  },
};

export default HomePage;