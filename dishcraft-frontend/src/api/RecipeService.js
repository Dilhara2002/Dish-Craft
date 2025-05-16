import axios from 'axios';

const API_URL = 'http://localhost:8080/api/recipes';

class RecipeService {
  static async createRecipe(recipeData, token, userId) {
    try {
      const response = await axios.post(API_URL, recipeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;
    }
  }

  static async getAllRecipes(token) {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      throw error;
    }
  }

  static async getRecipeById(id, token) {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  static async getRecipesByUser(userId, token) {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      throw error;
    }
  }

  static async updateRecipe(id, recipeData, token, userId) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, recipeData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': userId
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating recipe:', error);
      throw error;
    }
  }

  static async deleteRecipe(id, token, userId) {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'userId': userId
        }
      });
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }

  static async searchRecipes(query, token) {
    try {
      const response = await axios.get(`${API_URL}/search`, {
        params: { query },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching recipes:', error);
      throw error;
    }
  }
}

export default RecipeService;