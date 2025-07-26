const API_KEY = '734c040cf6c348519220a7b8d8951475';
const BASE_URL = 'https://api.spoonacular.com/recipes';

console.log('API Key:', API_KEY)

export const fetchRandomRecipes = async (count = 6) => {
  try {
    const response = await fetch(
      `${BASE_URL}/random?apiKey=${API_KEY}&number=${count}`
    );
    if (!response.ok) throw new Error('Failed to fetch recipes , API Limit Reached , Try Tommrow!');
    return await response.json();
  } catch (error) {
    console.error('Error fetching random recipes:', error);
    throw error;
  }
};

export const fetchRecipeById = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/information?apiKey=${API_KEY}&includeNutrition=true`
    );
    if (!response.ok) throw new Error('Failed to fetch recipes , API Limit Reached , Try Tommrow!');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const fetchRecipeInstructions = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}/analyzedInstructions?apiKey=${API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch recipes , API Limit Reached , Try Tommrow!');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe instructions:', error);
    throw error;
  }
};

export const searchRecipes = async (query, filters = {}) => {
  try {
    let url = `${BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${query}`;
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        url += `&${key}=${filters[key]}`;
      }
    });
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search recipes');
    return await response.json();
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};