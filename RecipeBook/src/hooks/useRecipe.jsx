import { useState, useEffect } from 'react';
import { getRecipes, getRecipeDetails } from '../utils/api';

export const useRecipes = (query = '', filters = {}) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await getRecipes(query, filters);
        setRecipes(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [query, filters]);

  return { recipes, loading, error };
};

export const useRecipeDetails = (id) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getRecipeDetails(id);
        setRecipe(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  return { recipe, loading, error };
};