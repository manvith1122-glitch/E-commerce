import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI, productAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const statusColors = {
  Pending: 'badge-warning', Processing: 'badge-info', Shipped: 'badge-primary',
  'Out for Delivery': 'badge-primary', Delivered: 'badge-success',
  Cancelled: 'badge-danger', Refunded: 'badge-secondary',
};

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const { data } = await orderAPI.getDashboardStats();
        setStats(data.stats);
      } else if (tab === 'products') {
        const { data } = await productAPI.getAll({ limit: 50 });
        setProducts(data.products);
      } else if (tab === 'orders') {
        const { data } = await orderAPI.getAll({ limit: 50 });
        setOrders(data.orders);
      } else if (tab === 'users') {
        const { data } = await userAPI.getAll();
        setUsers(data.users);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (productForm._id) {
        await productAPI.update(productForm._id, productForm);
        toast.success('Product updated');
      } else {
        await productAPI.create(productForm);
        toast.success('Product created');
      }
      setProductForm(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success(`Status updated to ${status}`);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: status } : o));
    } catch { toast.error('Update failed'); }
  };

  const TABS = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'products', label: '📦 Products' },
    { id: 'orders', label: '🛒 Orders' },
    { id: 'users', label: '👥 Users' },
  ];

  const PRODUCT_CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys', 'Beauty', 'Food', 'Other'];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>⚙️ Admin Panel</h1>
          <p>Manage your store</p>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          {TABS.map(t => (
            <button
              key={t.id}
              style={{ ...styles.tab, ...(tab === t.id ? styles.tabActive : {}) }}
              onClick={() => setTab(t.id)}
            >{t.label}</button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <>
            {/* Dashboard */}
            {tab === 'dashboard' && stats && (
              <div>
                <div className="grid grid-4" style={{ marginBottom: '24px' }}>
                  {[
                    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: '#3498db' },
                    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: '💰', color: '#27ae60' },
                    { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: '#f39c12' },
                    { label: 'Delivered', value: stats.deliveredOrders, icon: '✅', color: '#2ecc71' },
                  ].map(s => (
                    <div key={s.label} className="card" style={{ borderTop: `4px solid ${s.color}` }}>
                      <div className="flex-between">
                        <div>
                          <p style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>{s.label}</p>
                          <p style={{ fontSize: '28px', fontWeight: '800', color: s.color, marginTop: '4px' }}>{s.value}</p>
                        </div>
                        <span style={{ fontSize: '36px' }}>{s.icon}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {stats.revenueByDay?.length > 0 && (
                  <div className="card">
                    <h3 style={{ marginBottom: '20px' }}>Revenue (Last 7 Days)</h3>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '150px' }}>
                      {stats.revenueByDay.map(d => {
                        const maxRev = Math.max(...stats.revenueByDay.map(r => r.revenue));
                        const pct = maxRev > 0 ? (d.revenue / maxRev) * 100 : 0;
                        return (
                          <div key={d._id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', color: '#e94560', fontWeight: '700' }}>₹{Math.round(d.revenue)}</span>
                            <div style={{ width: '100%', height: `${pct}%`, background: '#e94560', borderRadius: '6px 6px 0 0', minHeight: '4px' }} />
                            <span style={{ fontSize: '10px', color: '#aaa' }}>{d._id.slice(5)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Products */}
            {tab === 'products' && (
              <div>
                <div className="flex-between mb-16">
                  <h3>{products.length} Products</h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => setProductForm({ name: '', description: '', price: '', category: 'Electronics', stock: 0, featured: false })}
                  >
                    + Add Product
                  </button>
                </div>

                {productForm && (
                  <div className="card" style={{ marginBottom: '24px', border: '2px solid #e94560' }}>
                    <h3 style={{ marginBottom: '20px' }}>{productForm._id ? 'Edit Product' : 'Add New Product'}</h3>
                    <form onSubmit={handleSaveProduct}>
                      <div className="grid grid-2">
                        <div className="form-group">
                          <label>Product Name</label>
                          <input className="form-control" required value={productForm.name}
                            onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Category</label>
                          <select className="form-control" value={productForm.category}
                            onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}>
                            {PRODUCT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Price (₹)</label>
                          <input type="number" className="form-control" required value={productForm.price}
                            onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Original Price (₹)</label>
                          <input type="number" className="form-control" value={productForm.originalPrice || ''}
                            onChange={e => setProductForm(p => ({ ...p, originalPrice: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Stock</label>
                          <input type="number" className="form-control" required value={productForm.stock}
                            onChange={e => setProductForm(p => ({ ...p, stock: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Brand</label>
                          <input className="form-control" value={productForm.brand || ''}
                            onChange={e => setProductForm(p => ({ ...p, brand: e.target.value }))} />
                        </div>
                        <div className="form-group">
                          <label>Thumbnail URL</label>
                          <input className="form-control" value={productForm.thumbnail || ''}
                            onChange={e => setProductForm(p => ({ ...p, thumbnail: e.target.value }))} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '28px' }}>
                          <input type="checkbox" id="featured" checked={productForm.featured || false}
                            onChange={e => setProductForm(p => ({ ...p, featured: e.target.checked }))} />
                          <label htmlFor="featured" style={{ textTransform: 'none', fontSize: '15px' }}>Featured Product</label>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" rows={3} required value={productForm.description}
                          onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                          {saving ? 'Saving...' : 'Save Product'}
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => setProductForm(null)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Featured</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img src={p.thumbnail || `https://picsum.photos/seed/${p._id}/50/50`} alt=""
                                style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                              <span style={{ fontWeight: '600', color: '#1a1a2e' }}>{p.name}</span>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td style={{ fontWeight: '600' }}>₹{p.price.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= 5 ? 'badge-warning' : 'badge-success'}`}>
                              {p.stock}
                            </span>
                          </td>
                          <td>{p.featured ? '⭐' : '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className="btn btn-outline btn-sm"
                                onClick={() => setProductForm({ ...p })}>Edit</button>
                              <button className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders */}
            {tab === 'orders' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>{orders.length} Orders</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Update Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o._id}>
                          <td>
                            <Link to={`/orders/${o._id}`} style={{ fontFamily: 'monospace', color: '#e94560', fontWeight: '700' }}>
                              #{o._id.slice(-8).toUpperCase()}
                            </Link>
                          </td>
                          <td>{o.user?.name || '—'}</td>
                          <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: '600' }}>₹{o.totalPrice.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${statusColors[o.orderStatus] || 'badge-secondary'}`}>
                              {o.orderStatus}
                            </span>
                          </td>
                          <td>
                            <select
                              className="form-control"
                              style={{ padding: '4px 8px', fontSize: '13px', width: '160px' }}
                              value={o.orderStatus}
                              onChange={e => handleUpdateStatus(o._id, e.target.value)}
                            >
                              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users */}
            {tab === 'users' && (
              <div>
                <h3 style={{ marginBottom: '16px' }}>{users.length} Users</h3>
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '32px', height: '32px', background: '#e94560',
                                borderRadius: '50%', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '13px',
                              }}>
                                {u.name[0].toUpperCase()}
                              </div>
                              {u.name}
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={async () => {
                                const newRole = u.role === 'admin' ? 'user' : 'admin';
                                await userAPI.update(u._id, { role: newRole });
                                toast.success(`Role changed to ${newRole}`);
                                loadData();
                              }}
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  tabs: { display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', border: '2px solid #e9ecef', borderRadius: '10px',
    background: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    color: '#666', transition: 'all 0.2s',
  },
  tabActive: { background: '#1a1a2e', borderColor: '#1a1a2e', color: '#fff' },
};

export default AdminPage;