import React from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from '../RecipeCard/RecipeCard';
import './SavedRecipes.css';

const SavedRecipes = () => {
  const { savedRecipes, removeSavedRecipe } = useRecipes();

  return (
    <div className="saved-recipes-container">
      {/* Hero Section */}
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
            <img src="https://images.pexels.com/photos/6419600/pexels-photo-6419600.jpeg" alt="Layered dessert" />
          </div>
          
          <div className="saved-hero-image-2">
            <img src="https://images.pexels.com/photos/6419600/pexels-photo-6419600.jpeg" alt="Bowl dish" />
          </div>
          
          <div className="saved-hero-image-3">
            <img src="https://images.pexels.com/photos/6419600/pexels-photo-6419600.jpeg" alt="Salmon with lemon on yellow plate" />
            <div className="saved-hero-discover-btn">DISCOVER</div>
          </div>
          
          <div className="saved-hero-herb-1"></div>
          <div className="saved-hero-herb-2"></div>
        </div>
      </div>

      {savedRecipes.length === 0 ? (
        <div className="empty-message">
            <div>
                <img src="/no-recipe.png" width="256" height="256" alt="" />
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