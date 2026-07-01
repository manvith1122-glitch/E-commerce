import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice >= 500 ? 0 : 50;
  const tax = parseFloat((totalPrice * 0.18).toFixed(2));
  const grandTotal = parseFloat((totalPrice + shipping + tax).toFixed(2));

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="empty-state">
            <span className="icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>🛒 Shopping Cart</h1>
          <p>{totalItems} items</p>
        </div>

        <div style={styles.layout}>
          {/* Items */}
          <div style={styles.itemsCol}>
            <div className="card">
              <div className="flex-between mb-16">
                <h3>Cart Items</h3>
                <button onClick={clearCart} className="btn btn-outline btn-sm" style={{ borderColor: '#e74c3c', color: '#e74c3c' }}>
                  Clear All
                </button>
              </div>

              {cart.map(item => (
                <div key={item.product} style={styles.cartItem}>
                  <img
                    src={item.thumbnail || `https://picsum.photos/seed/${item.product}/100/100`}
                    alt={item.name}
                    style={styles.itemImg}
                  />
                  <div style={styles.itemInfo}>
                    <Link to={`/products/${item.product}`} style={styles.itemName}>{item.name}</Link>
                    <span style={styles.itemPrice}>₹{item.price.toLocaleString()}</span>
                  </div>
                  <div style={styles.qtyControl}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product, item.quantity - 1)}
                    >−</button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => updateQuantity(item.product, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >+</button>
                  </div>
                  <div style={{ textAlign: 'right', minWidth: '80px' }}>
                    <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                  </div>
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeFromCart(item.product)}
                  >✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div style={styles.summaryCol}>
            <div className="card">
              <h3 style={{ marginBottom: '20px' }}>Order Summary</h3>

              <div style={styles.summaryRow}>
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#27ae60' : 'inherit' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>
              {totalPrice < 500 && (
                <p style={styles.freeShippingHint}>
                  Add ₹{(500 - totalPrice).toFixed(0)} more for free shipping!
                </p>
              )}
              <hr style={{ margin: '16px 0', border: 'none', borderTop: '2px solid #f0f0f0' }} />
              <div style={{ ...styles.summaryRow, fontWeight: '700', fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: '#e94560' }}>₹{grandTotal.toLocaleString()}</span>
              </div>

              <button className="btn btn-primary btn-lg btn-block" style={{ marginTop: '20px' }} onClick={handleCheckout}>
                Proceed to Checkout →
              </button>
              <Link to="/products" className="btn btn-outline btn-block" style={{ marginTop: '10px' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  itemsCol: { flex: 1, minWidth: '300px' },
  summaryCol: { width: '320px', flexShrink: 0, position: 'sticky', top: '80px' },
  cartItem: {
    display: 'flex', alignItems: 'center', gap: '16px',
    padding: '16px 0', borderBottom: '1px solid #f0f0f0',
  },
  itemImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', background: '#f8f9fa', flexShrink: 0 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemName: { fontWeight: '600', color: '#1a1a2e', fontSize: '15px', display: 'block', marginBottom: '4px' },
  itemPrice: { color: '#666', fontSize: '14px' },
  qtyControl: {
    display: 'flex', alignItems: 'center',
    border: '2px solid #e9ecef', borderRadius: '8px', overflow: 'hidden',
  },
  qtyBtn: { width: '32px', height: '32px', border: 'none', background: '#f8f9fa', fontSize: '16px', cursor: 'pointer', fontWeight: '700' },
  qtyNum: { width: '36px', textAlign: 'center', fontWeight: '700', fontSize: '14px' },
  removeBtn: { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px', padding: '4px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' },
  freeShippingHint: {
    background: '#fff3cd', color: '#856404',
    padding: '8px 12px', borderRadius: '8px', fontSize: '13px', marginTop: '8px',
  },
};

export default CartPage;