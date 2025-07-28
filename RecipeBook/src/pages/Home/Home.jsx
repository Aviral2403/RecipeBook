import React, { useEffect, useState } from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Pagination from '../../components/Pagination/Pagination';
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
  const { 
    recipes, 
    loading, 
    error, 
    currentPage,
    totalPages,
    totalResults,
    isRandomMode,
    getRandomRecipes, 
    searchRecipesByQuery,
    loadMoreRandomRecipes,
    goToPage,
    resetPagination
  } = useRecipes();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery && isInitialLoad) {
      // Load 12 random recipes for initial homepage load
      getRandomRecipes(12, false); // false = don't append, it's initial load
      setIsInitialLoad(false);
    }
  }, [searchQuery, isInitialLoad]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      resetPagination(); // Reset pagination for new search
      await searchRecipesByQuery(searchQuery.trim(), {}, 1, 12, true);
      setIsSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearchQuery('');
    setIsSearching(true);
    resetPagination(); // Reset pagination
    await getRandomRecipes(12, false); // Reset to initial random recipes
    setIsSearching(false);
  };

  const handlePageChange = async (page) => {
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await goToPage(page);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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
          onKeyPress={handleKeyPress}
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
                    getRandomRecipes(12, false);
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
              {/* Results header */}
              {searchQuery && totalResults > 0 && !isRandomMode && (
                <div className="results-header">
                  <h2>Search Results for "{searchQuery}"</h2>
                  <button 
                    className="clear-search-btn"
                    onClick={handleClearSearch}
                  >
                    ✕ Clear Search
                  </button>
                </div>
              )}
              
              
              
              {/* Show recipes */}
              <div className="recipes-grid">
                {recipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
              
              {/* Load More Button for Random Recipes */}
              {isRandomMode && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={() => loadMoreRandomRecipes(12)}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner small"></div>
                        Loading More...
                      </>
                    ) : (
                      'Load More Recipes'
                    )}
                  </button>
                </div>
              )}
              
              {/* Pagination Component - Only show for search results */}
              {!isRandomMode && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalResults}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}
              
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;