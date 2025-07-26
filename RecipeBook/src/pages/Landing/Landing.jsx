import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecipes } from "../../context/RecipeContext";
import TestimonialCarousel from "../../components/TestimonialCarousel/TestimonialCarousel";
import LoadingSkeleton from "../../components/LoadingSkeleton/LoadingSkeleton";
import "./Landing.css";

const Landing = () => {
  const { recipes, getRandomRecipes, loading, error } = useRecipes();
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Load fewer recipes to reduce memory usage
    getRandomRecipes(6); // Reduced from 6 to 4
  }, []);

  // Reduced video array for better performance
  const cookingVideos = isMobile ? 
    ["./video-1.webm", "./video-2.webm"] : // Only 2 videos on mobile
    ["./video-1.webm", "./video-2.webm", "./video-3.webm"]; // 3 videos on desktop

  // Cycle through videos instead of playing all simultaneously
  useEffect(() => {
    if (!isMobile && cookingVideos.length > 1) {
      const interval = setInterval(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % cookingVideos.length);
        setVideoLoaded(false);
      }, 8000); // Change video every 8 seconds

      return () => clearInterval(interval);
    }
  }, [cookingVideos.length, isMobile]);

  // Cleanup video on component unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
  }, []);

  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  const handleVideoError = () => {
    console.warn('Video failed to load, using fallback');
    setVideoLoaded(true); // Still show static background
  };

  const LandingRecipeCard = ({ recipe }) => {
    const handleRecipeClick = () => {
      navigate(`/recipe/${recipe.id}`);
    };

    return (
      <div className="retro-recipe-card" onClick={handleRecipeClick}>
        <div className="recipe-card-header">
          <div className="card-corner-ornament top-left"></div>
          <div className="card-corner-ornament top-right"></div>
          <h3 className="recipe-card-title">{recipe.title}</h3>
        </div>
        <div className="recipe-image-frame">
          <img
            src={recipe.image || "/placeholder.jpg"}
            onError={(e) => {
              e.target.src = "/placeholder.jpg";
            }}
            alt={recipe.title}
            className="recipe-card-image"
            loading="lazy"
            // Add explicit dimensions to prevent layout shift
            width="300"
            height="200"
          />
          <div className="image-border"></div>
        </div>
        <div className="recipe-card-content">
          <div className="recipe-divider"></div>
          <p className="recipe-chef">Chef {recipe.sourceName || "Master"}</p>
          <div className="recipe-details">
            <span className="recipe-est">Est. Prep Time</span>
            <span className="recipe-time">30 mins</span>
          </div>
        </div>
        <div className="card-corner-ornament bottom-left"></div>
        <div className="card-corner-ornament bottom-right"></div>
      </div>
    );
  };

  // Show skeleton only for the initial recipe loading
  if (loading && recipes.length === 0) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="landing-container">
      {/* Hero Section - Optimized for mobile */}
      <section className="hero-section">
        <div className="hero-background">
          {/* Always show static background first */}
          <div className="hero-static-bg" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            opacity: videoLoaded && !isMobile ? 0 : 1,
            transition: 'opacity 1s ease-in-out'
          }} />
          
          {/* Only load video on desktop or good connection */}
          {!isMobile && (
            <video
              ref={videoRef}
              className="hero-video hero-video-1"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata" // Changed from "none" to "metadata"
              onLoadedData={handleVideoLoad}
              onError={handleVideoError}
              style={{
                opacity: videoLoaded ? 1 : 0,
                transition: 'opacity 1s ease-in-out'
              }}
              // Add size constraints
              width="100%"
              height="100%"
            >
              <source src={cookingVideos[currentVideoIndex]} type="video/webm" />
            </video>
          )}
          
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>The Easiest Way To Make Your Favorite Meal</h1>
            <p>
              Discover 1000+ recipes in your hand with the best recipe. Help you
              to find the easiest way to cook.
            </p>
            <Link to='/recipes'>
              <button className="explore-btn">Explore Recipes</button>
            </Link>
          </div>
        </div>
      </section>

      <section className="retro-menu-section">
        <div className="menu-background">
          <div className="menu-texture"></div>
        </div>
        <div className="menu-header">
          <div className="menu-title-ornament">
            <div className="ornament-line left"></div>
            <h2 className="menu-title">Chef's Special Selection</h2>
            <div className="ornament-line right"></div>
          </div>
          <p className="menu-subtitle">Our most beloved recipes of this week</p>
          <Link to="/recipes">
            <button className="vintage-btn">View Full Menu</button>
          </Link>
        </div>
        
        {error ? (
          <div className="error">{error}</div>
        ) : recipes.length > 0 ? (
          <div className="retro-recipes-grid">
            {recipes.slice(0, 4).map((recipe) => ( // Reduced from 6 to 4
              <LandingRecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          // Show fewer skeleton cards
          <div className="retro-recipes-grid">
            {Array.from({ length: 4 }).map((_, index) => ( // Reduced from 6 to 4
              <div key={index} className="recipe-skeleton-card">
                <div className="skeleton-header"></div>
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="retro-testimonial-section">
        <TestimonialCarousel />
      </section>

      <section className="breakfast-section">
        <div className="breakfast-container">
          <div className="content-wrapper">
            <div className="text-content">
              <h1 className="main-heading">
                Discover Simple,
                <br />
                Delicious and
                <br />
                <span className="highlight-text">Fast Recipes !</span>
              </h1>
              <p className="description">
                Discover simple recipes that bring joy to your table, every
                single day.
                <br />
                Satisfy your taste buds with quick, delicious meals anyone can
                make.
              </p>
              <Link to='/recipes'>
                <button className="explore-btn">Explore</button>
              </Link>
            </div>

            <div className="image-section">
              <div className="gradient-bg">
                <div className="bowl-image">
                  <img
                    src="https://images.pexels.com/photos/17132216/pexels-photo-17132216.jpeg"
                    alt="Healthy bowl with tofu, vegetables, and greens"
                    className="food-bowl"
                    loading="lazy"
                    // Add explicit dimensions
                    width="400"
                    height="300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;