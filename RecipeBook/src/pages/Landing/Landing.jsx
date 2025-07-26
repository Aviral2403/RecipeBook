import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecipes } from "../../context/RecipeContext";
import TestimonialCarousel from "../../components/TestimonialCarousel/TestimonialCarousel";
import LoadingSkeleton from "../../components/LoadingSkeleton/LoadingSkeleton";
import "./Landing.css";

const Landing = () => {
  const { recipes, getRandomRecipes, loading, error } = useRecipes();
  const navigate = useNavigate();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [videosLoaded, setVideosLoaded] = useState(false);
  const [testimonialLoaded, setTestimonialLoaded] = useState(false);
  const [allContentLoaded, setAllContentLoaded] = useState(false);

  useEffect(() => {
    getRandomRecipes(6);
  }, []);

  useEffect(() => {
    if (recipes.length > 0) {
      const imagePromises = recipes.slice(0, 8).map((recipe) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve; // Resolve even on error to not block loading
          img.src = recipe.image || "https://via.placeholder.com/300x200";
        });
      });

      const breakfastImagePromise = new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src =
          "https://images.pexels.com/photos/17132216/pexels-photo-17132216.jpeg";
      });

      imagePromises.push(breakfastImagePromise);

      Promise.all(imagePromises).then(() => {
        setImagesLoaded(true);
      });
    }
  }, [recipes]);

  useEffect(() => {
    const cookingVideos = [
      "./video-1.mp4",
      "./video-2.mp4",
      "./video-3.mp4",
      "./video-4.mp4",
      "./video-5.mp4",
    ];

    const videoPromises = cookingVideos.map((videoSrc) => {
      return new Promise((resolve) => {
        const video = document.createElement("video");
        video.onloadeddata = resolve;
        video.onerror = resolve; // Resolve even on error
        video.src = videoSrc;
      });
    });

    Promise.all(videoPromises).then(() => {
      setVideosLoaded(true);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTestimonialLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (
      !loading &&
      !error &&
      imagesLoaded &&
      videosLoaded &&
      testimonialLoaded &&
      recipes.length > 0
    ) {
      const timer = setTimeout(() => {
        setAllContentLoaded(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [
    loading,
    error,
    imagesLoaded,
    videosLoaded,
    testimonialLoaded,
    recipes.length,
  ]);

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
              e.target.src = "/placeholder.jpg"; // Fallback if image fails to load
            }}
            alt={recipe.title}
            className="recipe-card-image"
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

  const cookingVideos = [
    "./video-1.mp4",
    "./video-2.mp4",
    "./video-3.mp4",
    "./video-4.mp4",
    "./video-5.mp4",
  ];

  if (!allContentLoaded) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          {cookingVideos.map((video, index) => (
            <video
              key={index}
              className={`hero-video hero-video-${index + 1}`}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={video} type="video/mp4" />
            </video>
          ))}
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
          <Link to="/home">
            <button className="vintage-btn">View Full Menu</button>
          </Link>
        </div>
        {error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="retro-recipes-grid">
            {recipes.slice(0, 8).map((recipe) => (
              <LandingRecipeCard key={recipe.id} recipe={recipe} />
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
