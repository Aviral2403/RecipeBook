import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { addRecipeReview, getRecipeReviews } from '../../utils/api';
import './Reviews.css';

const Reviews = ({ recipeId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const trackRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await getRecipeReviews(recipeId);
        setReviews(data);
        setHasMore(data.length === 5);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, [recipeId]);

  useEffect(() => {
    const animate = () => {
      if (!isHovered && reviews.length > 0) {
        const speed = isMobile ? 0.3 : 0.5;
        
        positionRef.current -= speed;

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${positionRef.current}px)`;
          
          // Reset position when track has scrolled completely
          const cardWidth = isMobile ? 320 : 400;
          const gap = isMobile ? 24 : 40;
          const singleSetWidth = (cardWidth + gap) * reviews.length;
          
          if (Math.abs(positionRef.current) >= singleSetWidth) {
            positionRef.current = 0;
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (reviews.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, isMobile, reviews.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await addRecipeReview(recipeId, rating, comment, userName);
      setReviews([data, ...reviews]);
      setShowForm(false);
      setRating(3);
      setComment('');
      setUserName(user?.name || '');
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMore = async () => {
    const newOffset = offset + 5;
    try {
      const { data } = await getRecipeReviews(recipeId, 5, newOffset);
      setReviews([...reviews, ...data]);
      setOffset(newOffset);
      setHasMore(data.length === 5);
    } catch (err) {
      console.error('Error loading more reviews:', err);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setRating(3);
    setComment('');
    setUserName(user?.name || '');
  };

  const renderStars = (reviewRating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < reviewRating ? "vintage-review-star filled" : "vintage-review-star"}>
        ★
      </span>
    ));
  };

  const renderReview = (review, index) => (
    <div key={`${review._id}-${index}`} className="vintage-review-testimonial">
      <div className="review-parchment">
        <div className="review-header">
          <div className="reviewer-details">
            <h4 className="reviewer-name">{review.userName}</h4>
            <div className="review-rating-stars">{renderStars(review.rating)}</div>
          </div>
        </div>

        <div className="review-content">
          <div className="quote-marks opening-quote">"</div>
          <p className="review-text">{review.comment}</p>
          <div className="quote-marks closing-quote">"</div>
          
          <div className="review-date-mention">
            <span className="date-label">Shared on:</span>
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="vintage-reviews-section">
      <div className="reviews-background">
        <div className="parchment-texture"></div>
      </div>

      <div className="reviews-header">
        <div className="header-ornament">
          <div className="ornament-line left-ornament"></div>
          <h2 className="reviews-title">Culinary Impressions</h2>
          <div className="ornament-line right-ornament"></div>
        </div>
        <p className="reviews-subtitle">Stories from fellow culinary enthusiasts</p>
        
        <button 
          className="vintage-share-button"
          onClick={() => setShowForm(true)}
        >
          Share Your Experience
        </button>
      </div>

      {/* Popup Overlay */}
      {showForm && (
        <div className="vintage-popup-overlay" onClick={closeForm}>
          <div className="vintage-popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-parchment">
              <div className="vintage-popup-header">
                <div className="popup-header-ornament">
                  <div className="popup-ornament-line"></div>
                  <h3>Share Your Culinary Tale</h3>
                  <div className="popup-ornament-line"></div>
                </div>
                <button className="vintage-close-button" onClick={closeForm}>
                  ×
                </button>
              </div>
              
              <form className="vintage-review-form" onSubmit={handleSubmit}>
                {!user && (
                  <div className="vintage-form-group">
                    <label className="vintage-form-label">Your Good Name</label>
                    <input
                      type="text"
                      className="vintage-form-input"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      maxLength="50"
                    />
                  </div>
                )}
                
                <div className="vintage-form-group">
                  <label className="vintage-form-label">Your Rating</label>
                  <div className="vintage-star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`vintage-form-star ${star <= rating ? 'filled' : ''}`}
                        onClick={() => setRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="vintage-form-group">
                  <label className="vintage-form-label">Your Culinary Tale</label>
                  <textarea
                    className="vintage-form-textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your culinary experience and thoughts..."
                    required
                    maxLength="500"
                  />
                </div>
                
                <div className="vintage-form-actions">
                  <button 
                    type="button" 
                    className="vintage-cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="vintage-submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Tale'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div
        className="vintage-reviews-carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {reviews.length > 0 ? (
          <div className="reviews-track-wrapper">
            <div ref={trackRef} className="reviews-carousel-track">
              {[...reviews, ...reviews, ...reviews].map((review, i) =>
                renderReview(review, i)
              )}
            </div>
          </div>
        ) : (
          <div className="vintage-no-reviews">
            <div className="no-reviews-parchment">
              <p>No culinary tales yet. Be the first to share your experience!</p>
            </div>
          </div>
        )}
        
        {hasMore && reviews.length > 0 && (
          <div className="load-more-section">
            <button 
              className="vintage-load-more"
              onClick={loadMore}
            >
              Discover More Tales
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;