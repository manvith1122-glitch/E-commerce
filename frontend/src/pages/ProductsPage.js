import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('keyword') || '');

  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Number(searchParams.get('page')) || 1;
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (category) params.category = category;
      if (featured) params.featured = featured;
      if (search) params.keyword = search;

      const { data } = await productAPI.getAll(params);
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, sort, category, featured, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());
    if (value) params[key] = value; else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam('keyword', search);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={styles.layout}>
          {/* Sidebar */}
          <aside style={styles.sidebar}>
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={styles.sidebarTitle}>Categories</h3>
              <div style={styles.catList}>
                <button
                  style={{ ...styles.catItem, ...(category === '' ? styles.catItemActive : {}) }}
                  onClick={() => setParam('category', '')}
                >
                  All Categories
                </button>
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    style={{ ...styles.catItem, ...(category === c ? styles.catItemActive : {}) }}
                    onClick={() => setParam('category', c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 style={styles.sidebarTitle}>Filter</h3>
              <label style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>Featured Only</label>
              <div style={{ marginTop: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={featured === 'true'}
                    onChange={e => setParam('featured', e.target.checked ? 'true' : '')}
                  />
                  Show Featured
                </label>
              </div>
            </div>
          </aside>

          {/* Main */}
          <main style={styles.main}>
            {/* Search + Sort bar */}
            <div style={styles.toolbar}>
              <form onSubmit={handleSearch} style={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="form-control"
                  style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </form>
              <select
                value={sort}
                onChange={e => setParam('sort', e.target.value)}
                className="form-control"
                style={{ width: '200px' }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              {total} products found {category && `in ${category}`}
            </p>

            {loading ? (
              <div className="loading-spinner"><div className="spinner" /></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <span className="icon">🔍</span>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid products-grid">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {pages > 1 && (
                  <div className="pagination">
                    <button onClick={() => setParam('page', page - 1)} disabled={page === 1}>←</button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        className={p === page ? 'active' : ''}
                        onClick={() => setParam('page', p)}
                      >{p}</button>
                    ))}
                    <button onClick={() => setParam('page', page + 1)} disabled={page === pages}>→</button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  sidebar: { width: '220px', flexShrink: 0, position: 'sticky', top: '80px' },
  sidebarTitle: { fontSize: '14px', fontWeight: '700', marginBottom: '14px', color: '#1a1a2e', textTransform: 'uppercase', letterSpacing: '0.5px' },
  catList: { display: 'flex', flexDirection: 'column', gap: '4px' },
  catItem: {
    textAlign: 'left',
    padding: '8px 10px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    fontSize: '14px',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  catItemActive: { background: '#fdedef', color: '#e94560', fontWeight: '600' },
  main: { flex: 1, minWidth: 0 },
  toolbar: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  searchForm: { display: 'flex', gap: '8px', flex: 1, minWidth: '200px' },
};

export default ProductsPage;