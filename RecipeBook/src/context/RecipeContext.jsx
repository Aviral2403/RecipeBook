import React, { createContext, useContext, useState } from 'react';
import api from '../utils/axiosConfig'; // Import the configured axios instance
import { useAuth } from './AuthContext';
import { fetchRandomRecipes, fetchRecipeById, searchRecipes } from '../utils/api';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentFilters, setCurrentFilters] = useState({});
  const [isRandomMode, setIsRandomMode] = useState(false);
  
  // Add safety check for useAuth
  const authContext = useAuth();
  const token = authContext?.token;

  // Get saved recipes from backend
  const getSavedRecipes = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await api.get('/api/recipes/saved');
      setSavedRecipes(res.data.data.map(item => item.recipeData));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load saved recipes');
    } finally {
      setLoading(false);
    }
  };

  // Save recipe to backend
  const saveRecipe = async (recipe) => {
    if (!token) {
      setError('Please login to save recipes');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/recipes/save', {
        recipeId: recipe.id,
        recipeData: recipe
      });
      await getSavedRecipes(); // Refresh saved recipes list
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  // Remove saved recipe from backend
  const removeSavedRecipe = async (id) => {
    try {
      setLoading(true);
      await api.delete(`/api/recipes/save/${id}`);
      setSavedRecipes(savedRecipes.filter(recipe => recipe.id !== id));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove recipe');
    } finally {
      setLoading(false);
    }
  };

  // Fetch random recipes from Spoonacular API
  const getRandomRecipes = async (count = 6, append = false) => {
    setLoading(true);
    try {
      const data = await fetchRandomRecipes(count);
      
      if (append) {
        setRecipes(prev => [...prev, ...data.recipes]);
      } else {
        setRecipes(data.recipes);
      }
      
      setError(null);
      
      if (!append) {
        setCurrentPage(1);
        setTotalResults(0);
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

  // Fetch recipe details by ID from Spoonacular API
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

  // Search recipes from Spoonacular API
  const searchRecipesByQuery = async (query, filters = {}, page = 1, resultsPerPage = 12, resetResults = true) => {
    setLoading(true);
    try {
      const offset = (page - 1) * resultsPerPage;
      
      const paginationFilters = {
        ...filters,
        number: resultsPerPage,
        offset: offset
      };

      const data = await searchRecipes(query, paginationFilters);
      
      if (resetResults || page === 1) {
        setRecipes(data.results || []);
      } else {
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
      await getRandomRecipes(count, true);
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
        getSavedRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);