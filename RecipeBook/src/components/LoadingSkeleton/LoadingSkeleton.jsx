import React from "react";
import "./LoadingSkeleton.css";

const LoadingSkeleton = () => {
  return (
    <div className="skeleton-container">
      <section className="skeleton-hero">
        <div className="skeleton-hero-background">
          <div className="skeleton-overlay"></div>
        </div>
        <div className="skeleton-hero-content">
          <div className="skeleton-hero-text">
            <div className="skeleton-line skeleton-title"></div>
            <div className="skeleton-line skeleton-title-2"></div>
            <div className="skeleton-line skeleton-subtitle"></div>
            <div className="skeleton-line skeleton-subtitle-2"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      </section>

      <section className="skeleton-popular">
        <div className="skeleton-section-header">
          <div className="skeleton-line skeleton-section-title"></div>
          <div className="skeleton-line skeleton-section-subtitle"></div>
          <div className="skeleton-button skeleton-see-all"></div>
        </div>
        <div className="skeleton-recipes-grid">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="skeleton-recipe-card">
              <div className="skeleton-recipe-image"></div>
              <div className="skeleton-recipe-info">
                <div className="skeleton-line skeleton-recipe-title"></div>
                <div className="skeleton-line skeleton-recipe-author"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="skeleton-testimonial">
        <div className="skeleton-testimonial-container">
          <div className="skeleton-testimonial-card">
            <div className="skeleton-line skeleton-testimonial-text"></div>
            <div className="skeleton-line skeleton-testimonial-text-2"></div>
            <div className="skeleton-testimonial-author">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-author-info">
                <div className="skeleton-line skeleton-author-name"></div>
                <div className="skeleton-line skeleton-author-role"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skeleton-breakfast">
        <div className="skeleton-breakfast-container">
          <div className="skeleton-content-wrapper">
            <div className="skeleton-text-content">
              <div className="skeleton-line skeleton-main-heading"></div>
              <div className="skeleton-line skeleton-main-heading-2"></div>
              <div className="skeleton-line skeleton-main-heading-3"></div>
              <div className="skeleton-line skeleton-description"></div>
              <div className="skeleton-line skeleton-description-2"></div>
              <div className="skeleton-button skeleton-explore"></div>
            </div>
            <div className="skeleton-image-section">
              <div className="skeleton-food-bowl"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoadingSkeleton;