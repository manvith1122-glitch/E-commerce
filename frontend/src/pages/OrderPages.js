import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';

const statusColors = {
  Pending: 'badge-warning',
  Processing: 'badge-info',
  Shipped: 'badge-primary',
  'Out for Delivery': 'badge-primary',
  Delivered: 'badge-success',
  Cancelled: 'badge-danger',
  Refunded: 'badge-secondary',
};

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>📦 My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📭</span>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>Shop Now</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map(order => (
              <div key={order._id} className="card">
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>ORDER ID</p>
                    <p style={{ fontWeight: '700', fontFamily: 'monospace' }}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>DATE</p>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>TOTAL</p>
                    <p style={{ fontWeight: '700', color: '#e94560' }}>₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>STATUS</p>
                    <span className={`badge ${statusColors[order.orderStatus] || 'badge-secondary'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                    View Details →
                  </Link>
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {order.orderItems.slice(0, 4).map(item => (
                    <div key={item._id} style={{ fontSize: '13px', background: '#f8f9fa', padding: '4px 10px', borderRadius: '6px' }}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.orderItems.length > 4 && (
                    <span style={{ fontSize: '13px', color: '#aaa' }}>+{order.orderItems.length - 4} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then(({ data }) => setOrder(data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!order) return <div className="empty-state"><h3>Order not found</h3></div>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="flex-between mb-24" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link to="/orders" style={{ color: '#e94560', fontSize: '14px' }}>← Back to Orders</Link>
            <h1 style={{ marginTop: '8px', fontSize: '24px' }}>
              Order #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p style={{ color: '#666', marginTop: '4px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString()} •{' '}
              <span className={`badge ${statusColors[order.orderStatus] || 'badge-secondary'}`}>
                {order.orderStatus}
              </span>
            </p>
          </div>
          {order.trackingNumber && (
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', color: '#aaa', fontWeight: '600' }}>TRACKING NUMBER</p>
              <p style={{ fontWeight: '700', fontFamily: 'monospace', fontSize: '16px' }}>{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Progress tracker */}
        {order.orderStatus !== 'Cancelled' && order.orderStatus !== 'Refunded' && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '24px' }}>Order Progress</h3>
            <div style={styles.progress}>
              {STATUS_STEPS.map((step, i) => (
                <div key={step} style={styles.progressItem}>
                  <div style={{
                    ...styles.progressDot,
                    background: i <= currentStep ? '#27ae60' : '#e9ecef',
                    border: i === currentStep ? '3px solid #27ae60' : 'none',
                    transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
                  }}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: i <= currentStep ? '#1a1a2e' : '#aaa', marginTop: '8px', textAlign: 'center' }}>
                    {step}
                  </p>
                  {i < STATUS_STEPS.length - 1 && (
                    <div style={{ ...styles.progressLine, background: i < currentStep ? '#27ae60' : '#e9ecef' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.layout}>
          <div style={{ flex: 1 }}>
            {/* Items */}
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '16px' }}>Order Items</h3>
              {order.orderItems.map(item => (
                <div key={item._id} style={styles.orderItem}>
                  <img
                    src={item.image || `https://picsum.photos/seed/${item.product}/80/80`}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <Link to={`/products/${item.product}`} style={{ fontWeight: '600', color: '#1a1a2e' }}>
                      {item.name}
                    </Link>
                    <p style={{ color: '#666', fontSize: '13px' }}>₹{item.price.toLocaleString()} × {item.quantity}</p>
                  </div>
                  <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                </div>
              ))}
            </div>

            {/* Status History */}
            {order.statusHistory?.length > 0 && (
              <div className="card">
                <h3 style={{ marginBottom: '16px' }}>Status History</h3>
                {order.statusHistory.map((h, i) => (
                  <div key={i} style={styles.historyItem}>
                    <div style={styles.historyDot} />
                    <div>
                      <strong>{h.status}</strong>
                      <p style={{ fontSize: '13px', color: '#666' }}>{h.note}</p>
                      <p style={{ fontSize: '12px', color: '#aaa' }}>{new Date(h.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div className="card" style={{ marginBottom: '16px' }}>
              <h3 style={{ marginBottom: '16px' }}>Shipping To</h3>
              <p style={{ fontWeight: '600' }}>{order.shippingAddress.fullName}</p>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Payment</h3>
              <p style={{ color: '#666', marginBottom: '16px' }}>{order.paymentMethod}</p>
              {[
                ['Subtotal', `₹${order.itemsPrice?.toLocaleString()}`],
                ['Shipping', order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`],
                ['Tax', `₹${order.taxPrice}`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid #f0f0f0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: '#e94560' }}>₹{order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  progress: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' },
  progressItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' },
  progressDot: {
    width: '36px', height: '36px', borderRadius: '50%', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', transition: 'all 0.3s', zIndex: 1,
  },
  progressLine: {
    position: 'absolute', top: '18px', left: '50%', width: '100%',
    height: '3px', transition: 'background 0.3s',
  },
  orderItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
  historyItem: { display: 'flex', gap: '14px', marginBottom: '16px' },
  historyDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#e94560', flexShrink: 0, marginTop: '6px' },
};