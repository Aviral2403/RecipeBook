import React, { useState, useEffect, useRef } from "react";
import "./TestimonialCarousel.css";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    comment:
      "This recipe collection transformed my kitchen adventures completely! Every dish tells a beautiful story.",
    rating: 5,
    dish: "Classic Carbonara",
    location: "New York"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    comment:
      "The heritage recipes here remind me of my grandmother's cooking. Absolutely authentic and delightful.",
    rating: 5,
    dish: "Traditional Stir Fry",
    location: "San Francisco"
  },
  {
    id: 3,
    name: "Emma Williams",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    comment:
      "Each recipe feels like a treasured family heirloom. The instructions are beautifully detailed and clear.",
    rating: 5,
    dish: "Victorian Sponge Cake",
    location: "London"
  },
  {
    id: 4,
    name: "David Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    comment:
      "Found my perfect Sunday roast recipe here. The traditional methods create the most incredible flavors.",
    rating: 4,
    dish: "Heritage BBQ Ribs",
    location: "Austin"
  },
  {
    id: 5,
    name: "Olivia Martinez",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
    comment:
      "The vintage presentation makes cooking feel like an art form. Simply beautiful and so inspiring.",
    rating: 5,
    dish: "Mediterranean Garden",
    location: "Barcelona"
  },
  {
    id: 6,
    name: "James Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
    comment:
      "These time-honored recipes connect me to culinary traditions from around the world. Truly special.",
    rating: 5,
    dish: "Cedar Plank Salmon",
    location: "Seattle"
  },
  {
    id: 7,
    name: "Sophia Brown",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
    comment:
      "Learning traditional baking methods has been a wonderful journey. Every loaf tells a story of craftsmanship.",
    rating: 5,
    dish: "Artisan Banana Bread",
    location: "Portland"
  },
  {
    id: 8,
    name: "Daniel Taylor",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
    comment:
      "The authentic spice blends and traditional techniques create restaurant-quality dishes at home.",
    rating: 4,
    dish: "Royal Thai Curry",
    location: "Chicago"
  },
  {
    id: 9,
    name: "Isabella Garcia",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&h=80&fit=crop&crop=face",
    comment:
      "These heritage recipes help me create meals that bring my family together around the dinner table.",
    rating: 5,
    dish: "Rustic Vegetable Soup",
    location: "Mexico City"
  },
  {
    id: 10,
    name: "Ryan Cooper",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=80&h=80&fit=crop&crop=face",
    comment:
      "The old-world pizza techniques produce the most incredible authentic flavors. Absolutely perfect crust every time.",
    rating: 4,
    dish: "Neapolitan Margherita",
    location: "Boston"
  },
];

const TestimonialCarousel = () => {
  const [isHovered, setIsHovered] = useState(false);
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);
  const animationRef = useRef(null);
  const topPosRef = useRef(0);
  const bottomPosRef = useRef((-testimonials.length * 350) / 2);

  useEffect(() => {
    if (bottomTrackRef.current) {
      bottomPosRef.current = -bottomTrackRef.current.scrollWidth / 2;
    }

    const animate = () => {
      if (!isHovered) {
        topPosRef.current -= 0.5;
        bottomPosRef.current += 0.5;

        if (topTrackRef.current) {
          topTrackRef.current.style.transform = `translateX(${topPosRef.current}px)`;
          if (Math.abs(topPosRef.current) >= topTrackRef.current.scrollWidth / 2) {
            topPosRef.current = 0;
          }
        }

        if (bottomTrackRef.current) {
          bottomTrackRef.current.style.transform = `translateX(${bottomPosRef.current}px)`;
          if (Math.abs(bottomPosRef.current) >= bottomTrackRef.current.scrollWidth / 2) {
            bottomPosRef.current = 0 ;
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isHovered]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "vintage-star filled" : "vintage-star"}>
        ★
      </span>
    ));
  };

  const renderTestimonial = (testimonial, index) => (
    <div key={`${testimonial.id}-${index}`} className="vintage-testimonial-card">
      
      
      <div className="testimonial-parchment">
        <div className="parchment-header">
          <div className="customer-profile">
            <div className="vintage-avatar">
              <img src={testimonial.avatar} alt={testimonial.name} />
              <div className="avatar-frame"></div>
            </div>
            <div className="customer-details">
              <h4 className="customer-name">{testimonial.name}</h4>
              <p className="customer-location">of {testimonial.location}</p>
              <div className="rating-stars">{renderStars(testimonial.rating)}</div>
            </div>
          </div>
        </div>

        

        <div className="testimonial-content">
          <div className="quote-marks opening-quote">"</div>
          <p className="testimonial-text">{testimonial.comment}</p>
          <div className="quote-marks closing-quote">"</div>
          
          <div className="dish-mention">
            <span className="dish-label">Specialty Prepared:</span>
            <span className="dish-name">{testimonial.dish}</span>
          </div>
        </div>
      </div>

      
    </div>
  );

  return (
    <div className="vintage-testimonial-section">
      <div className="testimonial-background">
        <div className="parchment-texture"></div>
      </div>

      <div className="testimonial-header">
        <div className="header-ornament">
          <div className="ornament-line left-ornament"></div>
          <h2 className="testimonial-title">Tales from Our Kitchen</h2>
          <div className="ornament-line right-ornament"></div>
        </div>
        <p className="testimonial-subtitle">Cherished stories from our culinary family</p>
      </div>

      <div
        className="vintage-carousel-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="track-wrapper">
          <div ref={topTrackRef} className="carousel-track top-track">
            {[...testimonials, ...testimonials].map((t, i) =>
              renderTestimonial(t, i)
            )}
          </div>
        </div>

        <div className="track-wrapper">
          <div ref={bottomTrackRef} className="carousel-track bottom-track">
            {[...testimonials, ...testimonials].map((t, i) =>
              renderTestimonial(t, i)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;