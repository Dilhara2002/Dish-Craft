// src/main/java/com/dishcraft/service/RecipeServiceImpl.java
package com.dishcraft.service;

import com.dishcraft.model.Recipe;
import com.dishcraft.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RecipeServiceImpl implements RecipeService {

    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeServiceImpl(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    @Override
    public Recipe updateRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    @Override
    public void deleteRecipe(String id) {
        recipeRepository.deleteById(id);
    }

    @Override
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    @Override
    public Recipe getRecipeById(String id) {
        return recipeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Recipe> getRecipesByUser(String userId) {
        return recipeRepository.findByUserId(userId);
    }

    @Override
    public List<Recipe> searchRecipes(String query) {
        return recipeRepository.findByTitleContainingIgnoreCase(query);
    }
}