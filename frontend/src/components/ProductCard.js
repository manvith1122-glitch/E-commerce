import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => (
      <span key={s} className={`star ${s <= Math.round(rating) ? 'filled' : ''}`}>★</span>
    ))}
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addToCart(product);
    toast.success(`${product.name} added to cart!`, { autoClose: 1500 });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} style={styles.card}>
      <div style={styles.imageWrap}>
        <img
          src={product.thumbnail || `https://picsum.photos/seed/${product._id}/300/300`}
          alt={product.name}
          style={styles.image}
        />
        {discount > 0 && <span style={styles.discountBadge}>-{discount}%</span>}
        {product.stock === 0 && <div style={styles.outOfStock}>Out of Stock</div>}
        {product.featured && <span style={styles.featuredBadge}>⭐ Featured</span>}
      </div>

      <div style={styles.info}>
        <span style={styles.category}>{product.category}</span>
        <h3 style={styles.name}>{product.name}</h3>

        <div style={styles.ratingRow}>
          <Stars rating={product.ratings} />
          <span style={styles.reviewCount}>({product.numReviews})</span>
        </div>

        <div style={styles.priceRow}>
          <div>
            <span style={styles.price}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span style={styles.originalPrice}>₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <button
            style={{ ...styles.addBtn, ...(product.stock === 0 ? styles.addBtnDisabled : {}) }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? '—' : '+'}
          </button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p style={styles.stockWarning}>Only {product.stock} left!</p>
        )}
      </div>
    </Link>
  );
};

const styles = {
  card: {
    display: 'block',
    background: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    border: '1px solid #f0f0f0',
  },
  imageWrap: {
    position: 'relative',
    paddingTop: '75%',
    background: '#f8f9fa',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  discountBadge: {
    position: 'absolute',
    top: '10px', left: '10px',
    background: '#e94560',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: '10px', right: '10px',
    background: 'rgba(245,166,35,0.9)',
    color: '#fff',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
  },
  outOfStock: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
  },
  info: { padding: '14px' },
  category: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#e94560',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  name: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a2e',
    margin: '4px 0 8px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  ratingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '10px',
  },
  reviewCount: { fontSize: '12px', color: '#aaa' },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  originalPrice: {
    fontSize: '13px',
    color: '#aaa',
    textDecoration: 'line-through',
    marginLeft: '6px',
  },
  addBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e94560',
    color: '#fff',
    border: 'none',
    fontSize: '20px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  addBtnDisabled: {
    background: '#ddd',
    cursor: 'not-allowed',
  },
  stockWarning: {
    marginTop: '6px',
    fontSize: '11px',
    color: '#e74c3c',
    fontWeight: '600',
  },
};

export default ProductCard;