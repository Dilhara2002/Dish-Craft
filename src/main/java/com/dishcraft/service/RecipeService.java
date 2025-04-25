package com.dishcraft.service;

import com.dishcraft.model.Recipe;
import java.util.List;

public interface RecipeService {
    Recipe createRecipe(Recipe recipe, String userId);  // Add new recipe
    List<Recipe> getAllRecipes();  // Get all recipes
    List<Recipe> getRecipesByUser(String userId);  // Get recipes by user
    Recipe updateRecipe(String id, Recipe recipe, String userId);  // Update recipe
    void deleteRecipe(String id, String userId);  // Delete recipe
}
