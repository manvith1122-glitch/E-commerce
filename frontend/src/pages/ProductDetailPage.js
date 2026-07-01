import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Stars = ({ rating, interactive, onRate }) => (
  <div className="stars" style={{ cursor: interactive ? 'pointer' : 'default' }}>
    {[1,2,3,4,5].map(s => (
      <span
        key={s}
        className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}
        style={{ fontSize: '20px' }}
        onClick={() => interactive && onRate && onRate(s)}
      >★</span>
    ))}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await productAPI.getById(id);
        setProduct(data.product);
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to leave a review'); return; }
    setSubmitting(true);
    try {
      await productAPI.addReview(id, review);
      toast.success('Review submitted!');
      const { data } = await productAPI.getById(id);
      setProduct(data.product);
      setReview({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;
  if (!product) return <div className="empty-state"><span className="icon">😕</span><h3>Product not found</h3></div>;

  const images = product.images?.length ? product.images : [product.thumbnail || `https://picsum.photos/seed/${id}/600/600`];

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ marginBottom: '16px', fontSize: '13px', color: '#666' }}>
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> / {product.name}
        </div>

        <div style={styles.productLayout}>
          {/* Images */}
          <div style={styles.imagesCol}>
            <div style={styles.mainImg}>
              <img src={images[activeImg]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {images.length > 1 && (
              <div style={styles.thumbs}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    style={{ ...styles.thumb, ...(activeImg === i ? styles.thumbActive : {}) }}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div style={styles.infoCol}>
            <span style={styles.category}>{product.category}</span>
            {product.brand && <span style={{ ...styles.category, marginLeft: '8px', color: '#666' }}>{product.brand}</span>}

            <h1 style={styles.title}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
              <Stars rating={product.ratings} />
              <span style={{ color: '#666', fontSize: '14px' }}>({product.numReviews} reviews)</span>
            </div>

            <div style={styles.priceBlock}>
              <span style={styles.price}>₹{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <>
                  <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
                  <span style={styles.discount}>
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <p style={styles.description}>{product.description}</p>

            <div style={styles.stockInfo}>
              {product.stock > 0 ? (
                <span className="badge badge-success">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="badge badge-danger">✗ Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div style={styles.addToCart}>
                <div style={styles.qtyControl}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyNum}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={styles.qtyBtn}>+</button>
                </div>
                <button className="btn btn-primary btn-lg" onClick={handleAddToCart} style={{ flex: 1 }}>
                  🛒 Add to Cart
                </button>
              </div>
            )}

            <Link to="/cart" className="btn btn-secondary btn-lg btn-block" style={{ marginTop: '12px' }}>
              🏪 View Cart & Checkout
            </Link>
          </div>
        </div>

        {/* Reviews */}
        <div className="card" style={{ marginTop: '32px' }}>
          <h2 style={{ marginBottom: '24px' }}>Customer Reviews</h2>

          {product.reviews?.length === 0 ? (
            <p style={{ color: '#666' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ marginBottom: '32px' }}>
              {product.reviews.map(r => (
                <div key={r._id} style={styles.reviewCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={styles.reviewAvatar}>{r.name[0].toUpperCase()}</span>
                        <strong>{r.name}</strong>
                      </div>
                      <Stars rating={r.rating} />
                    </div>
                    <span style={{ color: '#aaa', fontSize: '13px' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ marginTop: '10px', color: '#555' }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {user && (
            <form onSubmit={handleReview} style={styles.reviewForm}>
              <h3>Write a Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <Stars rating={review.rating} interactive onRate={r => setReview(prev => ({ ...prev, rating: r }))} />
              </div>
              <div className="form-group">
                <label>Comment</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={review.comment}
                  onChange={e => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  productLayout: { display: 'flex', gap: '40px', flexWrap: 'wrap' },
  imagesCol: { flex: '0 0 480px', maxWidth: '480px', minWidth: '280px' },
  mainImg: {
    width: '100%', height: '400px',
    background: '#f8f9fa', borderRadius: '16px', overflow: 'hidden',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  thumbs: { display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' },
  thumb: {
    width: '70px', height: '70px', objectFit: 'cover',
    borderRadius: '8px', border: '2px solid transparent', cursor: 'pointer',
  },
  thumbActive: { borderColor: '#e94560' },
  infoCol: { flex: 1, minWidth: '280px' },
  category: { fontSize: '12px', fontWeight: '700', color: '#e94560', textTransform: 'uppercase', letterSpacing: '1px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1a1a2e', lineHeight: '1.3', marginTop: '8px' },
  priceBlock: { display: 'flex', alignItems: 'baseline', gap: '12px', margin: '16px 0' },
  price: { fontSize: '32px', fontWeight: '800', color: '#1a1a2e' },
  originalPrice: { fontSize: '18px', color: '#aaa', textDecoration: 'line-through' },
  discount: { fontSize: '14px', fontWeight: '700', color: '#27ae60', background: '#eafaf1', padding: '3px 10px', borderRadius: '20px' },
  description: { color: '#555', lineHeight: '1.7', margin: '16px 0', fontSize: '15px' },
  stockInfo: { margin: '16px 0' },
  addToCart: { display: 'flex', gap: '16px', alignItems: 'center', marginTop: '20px' },
  qtyControl: {
    display: 'flex', alignItems: 'center', gap: '0',
    border: '2px solid #e9ecef', borderRadius: '10px', overflow: 'hidden',
  },
  qtyBtn: {
    width: '40px', height: '44px', border: 'none', background: '#f8f9fa',
    fontSize: '20px', cursor: 'pointer', fontWeight: '700', color: '#1a1a2e',
  },
  qtyNum: { width: '44px', textAlign: 'center', fontWeight: '700', fontSize: '16px' },
  reviewCard: {
    padding: '16px', background: '#f8f9fa', borderRadius: '12px', marginBottom: '12px',
  },
  reviewAvatar: {
    width: '32px', height: '32px', background: '#e94560', color: '#fff',
    borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '14px',
  },
  reviewForm: {
    borderTop: '2px solid #f0f0f0', paddingTop: '24px', marginTop: '8px',
  },
};

export default ProductDetailPage;