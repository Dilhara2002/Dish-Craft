import axios from 'axios';

const API_URL = 'http://localhost:8080/api/recipes';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

export const createRecipe = async (recipeData, userId) => {
  try {
    const response = await axios.post(API_URL, recipeData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const getAllRecipes = async () => {
  try {
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

export const getRecipeById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

export const getUserRecipes = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    throw error;
  }
};

export const updateRecipe = async (id, recipeData, userId) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, recipeData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        userId: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

export const deleteRecipe = async (id, userId) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        userId: userId
      }
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

export const searchRecipes = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/search?query=${query}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
};