import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import { toast } from 'react-toastify';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'PayPal', 'Cash on Delivery'];

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    fullName: '', address: '', city: '', state: '',
    postalCode: '', country: 'India', phone: ''
  });
  const [payment, setPayment] = useState('Cash on Delivery');

  const shippingCost = totalPrice >= 500 ? 0 : 50;
  const tax = parseFloat((totalPrice * 0.18).toFixed(2));
  const grandTotal = parseFloat((totalPrice + shippingCost + tax).toFixed(2));

  const handleShipping = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({ product: item.product, quantity: item.quantity })),
        shippingAddress: shipping,
        paymentMethod: payment
      };
      const { data } = await orderAPI.create(orderData);
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        {/* Steps */}
        <div style={styles.steps}>
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={s} style={styles.stepItem}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? '#27ae60' : step === i + 1 ? '#e94560' : '#e9ecef',
                color: step >= i + 1 ? '#fff' : '#aaa',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: step === i + 1 ? '#e94560' : '#aaa' }}>{s}</span>
              {i < 2 && <div style={styles.stepLine} />}
            </div>
          ))}
        </div>

        <div style={styles.layout}>
          <div style={styles.formCol}>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <div className="card">
                <h2 style={{ marginBottom: '24px' }}>📦 Shipping Address</h2>
                <form onSubmit={handleShipping}>
                  <div className="grid-2 grid">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input className="form-control" required value={shipping.fullName}
                        onChange={e => setShipping(p => ({ ...p, fullName: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-control" value={shipping.phone}
                        onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Address</label>
                    <input className="form-control" required value={shipping.address}
                      onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} />
                  </div>
                  <div className="grid-2 grid">
                    <div className="form-group">
                      <label>City</label>
                      <input className="form-control" required value={shipping.city}
                        onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>State</label>
                      <input className="form-control" required value={shipping.state}
                        onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} />
                    </div>
                  </div>
                  <div className="grid-2 grid">
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input className="form-control" required value={shipping.postalCode}
                        onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} />
                    </div>
                    <div className="form-group">
                      <label>Country</label>
                      <input className="form-control" required value={shipping.country}
                        onChange={e => setShipping(p => ({ ...p, country: e.target.value }))} />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg">Continue to Payment →</button>
                </form>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card">
                <h2 style={{ marginBottom: '24px' }}>💳 Payment Method</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {PAYMENT_METHODS.map(m => (
                    <label key={m} style={{
                      ...styles.payOption,
                      ...(payment === m ? styles.payOptionActive : {})
                    }}>
                      <input type="radio" name="payment" value={m} checked={payment === m}
                        onChange={() => setPayment(m)} style={{ marginRight: '12px' }} />
                      <span style={{ fontSize: '15px' }}>
                        {m === 'Credit Card' && '💳'} {m === 'Debit Card' && '🏦'}
                        {m === 'PayPal' && '🅿️'} {m === 'Cash on Delivery' && '💵'} {m}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card">
                <h2 style={{ marginBottom: '24px' }}>📋 Order Review</h2>
                <div style={styles.reviewSection}>
                  <h4>Shipping to</h4>
                  <p>{shipping.fullName}, {shipping.address}, {shipping.city}, {shipping.state} - {shipping.postalCode}</p>
                </div>
                <div style={styles.reviewSection}>
                  <h4>Payment</h4>
                  <p>{payment}</p>
                </div>
                <div style={styles.reviewSection}>
                  <h4>Items ({cart.length})</h4>
                  {cart.map(item => (
                    <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>₹{(item.price * item.quantity).toLocaleString()}</strong>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={handlePlaceOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div style={styles.summaryCol}>
            <div className="card">
              <h3 style={{ marginBottom: '16px' }}>Order Summary</h3>
              {cart.map(item => (
                <div key={item.product} style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                  <img
                    src={item.thumbnail || `https://picsum.photos/seed/${item.product}/60/60`}
                    alt={item.name}
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '600' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
                  </div>
                  <strong style={{ fontSize: '14px' }}>₹{(item.price * item.quantity).toLocaleString()}</strong>
                </div>
              ))}
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #f0f0f0' }} />
              {[
                ['Subtotal', `₹${totalPrice.toLocaleString()}`],
                ['Shipping', shippingCost === 0 ? 'FREE' : `₹${shippingCost}`],
                ['Tax (18%)', `₹${tax}`],
              ].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>{l}</span><span>{v}</span>
                </div>
              ))}
              <hr style={{ margin: '12px 0', border: 'none', borderTop: '2px solid #f0f0f0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '18px' }}>
                <span>Total</span>
                <span style={{ color: '#e94560' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  steps: { display: 'flex', alignItems: 'center', marginBottom: '40px', justifyContent: 'center' },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', position: 'relative' },
  stepCircle: {
    width: '40px', height: '40px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '16px', transition: 'all 0.3s',
  },
  stepLine: { position: 'absolute', left: '50%', top: '20px', width: '120px', height: '2px', background: '#e9ecef' },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' },
  formCol: { flex: 1, minWidth: '300px' },
  summaryCol: { width: '300px', flexShrink: 0, position: 'sticky', top: '80px' },
  payOption: {
    display: 'flex', alignItems: 'center',
    padding: '14px 18px', border: '2px solid #e9ecef',
    borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s',
  },
  payOptionActive: { border: '2px solid #e94560', background: '#fdedef' },
  reviewSection: { padding: '16px 0', borderBottom: '1px solid #f0f0f0' },
};

export default CheckoutPage;