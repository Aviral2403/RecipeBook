import React, { createContext, useContext, useState } from 'react';
import { fetchRandomRecipes, fetchRecipeById, searchRecipes } from '../utils/api';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [isRandomMode, setIsRandomMode] = useState(false);

  const getRandomRecipes = async (count = 6, append = false) => {
    setLoading(true);
    try {
      const data = await fetchRandomRecipes(count);
      
      if (append) {
        // Append new recipes to existing ones
        setRecipes(prev => [...prev, ...data.recipes]);
      } else {
        // Replace recipes (initial load)
        setRecipes(data.recipes);
      }
      
      setError(null);
      
      // For random recipes, we don't need traditional pagination
      // Just track that we're in random mode
      if (!append) {
        setCurrentPage(1);
        setTotalResults(0); // We don't know the total for random recipes
        setTotalPages(0);
        setCurrentQuery('');
        setCurrentFilters({});
      }
      setIsRandomMode(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeById = async (id) => {
    setLoading(true);
    try {
      const data = await fetchRecipeById(id);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchRecipesByQuery = async (query, filters = {}, page = 1, resultsPerPage = 12, resetResults = true) => {
    setLoading(true);
    try {
      // Calculate offset for pagination
      const offset = (page - 1) * resultsPerPage;
      
      // Add pagination parameters to filters
      const paginationFilters = {
        ...filters,
        number: resultsPerPage,
        offset: offset
      };

      const data = await searchRecipes(query, paginationFilters);
      
      if (resetResults || page === 1) {
        // First page or new search - replace recipes
        setRecipes(data.results || []);
      } else {
        // Subsequent pages - append to existing recipes
        setRecipes(prev => [...prev, ...(data.results || [])]);
      }
      
      setError(null);
      setCurrentPage(page);
      setTotalResults(data.totalResults || 0);
      setTotalPages(Math.ceil((data.totalResults || 0) / resultsPerPage));
      setCurrentQuery(query);
      setCurrentFilters(filters);
      setIsRandomMode(false);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load more random recipes
  const loadMoreRandomRecipes = async (count = 12) => {
    if (!loading && isRandomMode) {
      await getRandomRecipes(count, true); // true = append to existing recipes
    }
  };

  // Load more recipes (for search results pagination)
  const loadMoreRecipes = async () => {
    if (currentPage < totalPages && !loading && !isRandomMode) {
      await searchRecipesByQuery(currentQuery, currentFilters, currentPage + 1, 12, false);
    }
  };

  // Go to specific page (only for search results)
  const goToPage = async (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading && !isRandomMode) {
      await searchRecipesByQuery(currentQuery, currentFilters, page, 12, true);
    }
  };

  const saveRecipe = (recipe) => {
    if (!savedRecipes.some(r => r.id === recipe.id)) {
      setSavedRecipes([...savedRecipes, recipe]);
    }
  };

  const removeSavedRecipe = (id) => {
    setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
  };

  // Reset pagination
  const resetPagination = () => {
    setCurrentPage(1);
    setTotalResults(0);
    setTotalPages(0);
    setCurrentQuery('');
    setCurrentFilters({});
    setIsRandomMode(false);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        savedRecipes,
        loading,
        error,
        currentPage,
        totalResults,
        totalPages,
        currentQuery,
        isRandomMode,
        getRandomRecipes,
        getRecipeById,
        searchRecipesByQuery,
        loadMoreRandomRecipes,
        loadMoreRecipes,
        goToPage,
        saveRecipe,
        removeSavedRecipe,
        resetPagination,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);