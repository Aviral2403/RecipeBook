import React, { useEffect } from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from '../RecipeCard/RecipeCard';
import './SavedRecipes.css';

const SavedRecipes = () => {
  const { savedRecipes, removeSavedRecipe, getSavedRecipes, loading } = useRecipes();

  useEffect(() => {
    getSavedRecipes();
  }, []);

  if (loading && savedRecipes.length === 0) {
    return (
      <div className="saved-recipes-container">
        <div className="loading-message">Loading your saved recipes...</div>
      </div>
    );
  }

  return (
    <div className="saved-recipes-container">
      {/* Hero Section - Original Structure */}
      <div className="saved-hero-section">
        <div className="saved-hero-content">
          <div className="saved-hero-left">
            <h1 className="saved-hero-title">
              Uncover<br />
              <span className="saved-hero-subtitle">the Flavors</span>
            </h1>
          </div>
          
          <div className="saved-hero-right">
            <div className="saved-hero-stats">
              <div className="saved-hero-stats-info">
                
              </div>
            </div>
          </div>
        </div>
        
        <div className="saved-hero-images">
          <div className="saved-hero-image-1">
            <img src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg" alt="Pancakes with berries" />
          </div>
          
          <div className="saved-hero-image-2">
            <img src="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg" alt="Pasta dish" />
          </div>
          
          <div className="saved-hero-image-3">
            <img src="https://images.pexels.com/photos/1234535/pexels-photo-1234535.jpeg" alt="Salmon dish" />
            <div className="saved-hero-discover-btn">DISCOVER</div>
          </div>
          
          <div className="saved-hero-herb-1"></div>
          <div className="saved-hero-herb-2"></div>
        </div>
      </div>

      {/* Description and Stats Section */}
      <div className="saved-description-section">
        <div className="saved-description-content">
          <p className="saved-description-text">
            Browse through your personally curated collection of culinary treasures. 
            Each recipe tells a story of your taste journey.
          </p>
          
          <div className="saved-stats-display">
            <div className="saved-stats-number">{savedRecipes.length}</div>
            <div className="saved-stats-info">
              <div className="saved-recipe-images">
                {savedRecipes.slice(0, 4).map((recipe, index) => (
                  <img 
                    key={index}
                    src={recipe.image || '/placeholder.jpg'} 
                    alt={recipe.title}
                    onError={(e) => e.target.src = '/placeholder.jpg'}
                  />
                ))}
              </div>
              <p className="saved-stats-text">
                {savedRecipes.length} carefully selected recipes in your collection
              </p>
            </div>
          </div>
        </div>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="empty-message">
          <div>
            <img src="/no-recipe.png" width="256" height="256" alt="No recipes" />
          </div>
          You haven't saved any recipes yet. Start exploring and save your favorites!
        </div>
      ) : (
        <div className="saved-recipes-grid">
          {savedRecipes.map(recipe => (
            <div key={recipe.id} className="saved-recipe-item">
              <RecipeCard recipe={recipe} />
              <button 
                className="remove-btn"
                onClick={() => removeSavedRecipe(recipe.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;