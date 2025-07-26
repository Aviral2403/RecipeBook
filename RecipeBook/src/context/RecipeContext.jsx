import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchRandomRecipes, fetchRecipeById, searchRecipes } from '../utils/api';

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRandomRecipes = async (count = 6) => {
    setLoading(true);
    try {
      const data = await fetchRandomRecipes(count);
      setRecipes(data.recipes);
      setError(null);
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

  const searchRecipesByQuery = async (query, filters = {}) => {
    setLoading(true);
    try {
      const data = await searchRecipes(query, filters);
      setRecipes(data.results);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        savedRecipes,
        loading,
        error,
        getRandomRecipes,
        getRecipeById,
        searchRecipesByQuery,
        saveRecipe,
        removeSavedRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);