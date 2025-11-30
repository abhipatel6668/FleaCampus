import React, { useState, useEffect } from 'react';
import '../styles/ProductDetail.css';

function ProductDetail({ product, onBack, onAddToCart, currentUser }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [product.product_id]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews/product/${product.product_id}`);
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUser.netid,
          product_id: product.product_id,
          rating,
          review_text: reviewText || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowReviewForm(false);
        setReviewText('');
        setRating(5);
        fetchReviews();
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings yet';

  return (
    <div className="product-detail">
      <button className="btn-back" onClick={onBack}>← Back to Products</button>
      
      <div className="detail-content">
        <div className="detail-left">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
          ) : (
            <div className="no-image-large">No Image</div>
          )}
        </div>

        <div className="detail-right">
          <h1>{product.name}</h1>
          <p className="detail-category">{product.category}</p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="detail-vendor">Seller: {product.vendor_netid}</p>
          
          <div className="rating-summary">
            <span className="stars">{'⭐'.repeat(Math.round(parseFloat(averageRating) || 0))}</span>
            <span className="rating-text">
              {averageRating} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          <button className="btn-add-cart-large" onClick={() => onAddToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {product.vendor_netid !== currentUser.netid && (
            <button 
              className="btn-write-review" 
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleSubmitReview}>
            <div className="form-group">
              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            <div className="form-group">
              <label>Review (Optional)</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Write your review here..."
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="loading">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.review_id} className="review-item">
                <div className="review-header">
                  <span className="review-user">{review.user_id}</span>
                  <span className="review-stars">{'⭐'.repeat(review.rating)}</span>
                </div>
                {review.review_text && (
                  <p className="review-text">{review.review_text}</p>
                )}
                <p className="review-date">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;