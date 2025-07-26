import React, { useEffect, useState } from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

const SearchBarSkeleton = () => (
  <div className="search-bar-skeleton">
    <div className="skeleton-search-container">
      <div className="skeleton-search-input"></div>
      <div className="skeleton-search-button"></div>
    </div>
  </div>
);

const RecipeCardSkeleton = () => (
  <div className="recipe-card-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-content">
      <div className="skeleton-title"></div>
      <div className="skeleton-subtitle"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-text short"></div>
      <div className="skeleton-footer">
        <div className="skeleton-badge"></div>
        <div className="skeleton-badge"></div>
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="recipes-grid">
    {Array.from({ length: 12 }).map((_, index) => (
      <RecipeCardSkeleton key={index} />
    ))}
  </div>
);

const Home = () => {
  const { recipes, loading, error, getRandomRecipes, searchRecipesByQuery } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
         
  useEffect(() => {
    if (!searchQuery) {
      getRandomRecipes(12);
    }
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchRecipesByQuery(searchQuery);
    }
  };
          
  return (
    <div className="home-container">
      {/* Hero Search Section */}
      {loading ? (
        <SearchBarSkeleton />
      ) : (
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
      )}
                    
      {/* Content Section */}
      <div className="content-section">
                           
        {/* Results Section */}
        <div className="results-section">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="no-results">
              <div className="no-results-image">
                <img src='/no-recipe.png' height='256' width='256'></img>
              </div>
              <h3>No recipes found</h3>
              <p>We couldn't find any recipes matching your search. Try different keywords or browse our random recipes!</p>
              <button 
                className="browse-random-btn"
                onClick={() => {
                  setSearchQuery('');
                  getRandomRecipes(12);
                }}
              >
                Browse Random Recipes
              </button>
            </div>
          ) : (
            <div className="recipes-grid">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;