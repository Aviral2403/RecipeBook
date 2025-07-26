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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery && isInitialLoad) {
      getRandomRecipes(12);
      setIsInitialLoad(false);
    }
  }, [searchQuery, isInitialLoad]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      await searchRecipesByQuery(searchQuery);
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(true);
    getRandomRecipes(12);
    setIsSearching(false);
  };

  // Show search bar immediately, don't wait for loading
  const showSearchBar = true;
  
  // Only show skeleton on initial load or when actively searching
  const showSkeleton = (loading && recipes.length === 0) || isSearching;

  return (
    <div className="home-container">
      {/* Hero Search Section - Always show immediately */}
      {showSearchBar ? (
        <SearchBar 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
        />
      ) : (
        <SearchBarSkeleton />
      )}
      
      {/* Content Section */}
      <div className="content-section">
        {/* Results Section */}
        <div className="results-section">
          {showSkeleton ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
              <button 
                className="retry-btn"
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleSearch();
                  } else {
                    getRandomRecipes(12);
                  }
                }}
              >
                Try Again
              </button>
            </div>
          ) : recipes.length === 0 && !loading ? (
            <div className="no-results">
              <div className="no-results-image">
                <img src='/no-recipe.png' height='256' width='256' alt="No recipes found" />
              </div>
              <h3>No recipes found</h3>
              <p>We couldn't find any recipes matching your search. Try different keywords or browse our random recipes!</p>
              <button 
                className="browse-random-btn"
                onClick={handleClearSearch}
              >
                Browse Random Recipes
              </button>
            </div>
          ) : (
            <>
              {/* Show recipes as they become available */}
              <div className="recipes-grid">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* Show additional skeletons if still loading more recipes */}
              {loading && recipes.length > 0 && (
                <div className="recipes-grid additional-loading">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <RecipeCardSkeleton key={`additional-${index}`} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;