// src/main/java/com/dishcraft/service/RecipeService.java
package com.dishcraft.service;

import com.dishcraft.model.Recipe;
import java.util.List;

public interface RecipeService {
    Recipe createRecipe(Recipe recipe);
    Recipe updateRecipe(Recipe recipe);
    void deleteRecipe(String id);
    List<Recipe> getAllRecipes();
    Recipe getRecipeById(String id);
    List<Recipe> getRecipesByUser(String userId);
    List<Recipe> searchRecipes(String query);
}