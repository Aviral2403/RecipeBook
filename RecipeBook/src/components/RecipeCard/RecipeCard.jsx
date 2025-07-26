import React from 'react';
import { Link } from 'react-router-dom';
import { useRecipes } from '../../context/RecipeContext';
import './RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const { saveRecipe, savedRecipes } = useRecipes();
  const isSaved = savedRecipes.some(r => r.id === recipe.id);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveRecipe(recipe);
  };

  return (
    <Link to={`/recipe/${recipe.id}`} className="recipe-card">
      <div className="recipe-card-inner">
        <div className="recipe-image-container">
          <img 
            src={recipe.image || '/placeholder.jpg'}
            alt={recipe.title}
            className="recipe-image"
            onError={(e) => {
                e.target.src = "/placeholder.jpg"; // Fallback if image fails to load
              }}
          />
          <div className="recipe-overlay">
            <button 
              className={`save-btn ${isSaved ? 'saved' : ''}`}
              onClick={handleSave}
              aria-label={isSaved ? 'Remove from saved' : 'Save recipe'}
            >
              <svg 
                className="save-icon" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                {isSaved ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <path d="M12 5v14M5 12h14" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        <div className="recipe-content">
          <div className="recipe-header">
            <h3 className="recipe-title">{recipe.title}</h3>
            <div className="decorative-line"></div>
          </div>
          
          <div className="recipe-meta">
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
              <span className="meta-text">{recipe.readyInMinutes} Min</span>
            </div>
            
            <div className="meta-item">
              <svg className="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
              <span className="meta-text">
                {recipe.spoonacularScore ? (recipe.spoonacularScore / 20).toFixed(1) : '4.5'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card-corner top-left"></div>
        <div className="card-corner top-right"></div>
        <div className="card-corner bottom-left"></div>
        <div className="card-corner bottom-right"></div>
      </div>
    </Link>
  );
};

export default RecipeCard;