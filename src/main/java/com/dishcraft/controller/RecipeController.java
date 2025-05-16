// src/main/java/com/dishcraft/controller/RecipeController.java
package com.dishcraft.controller;

import com.dishcraft.dto.RecipeRequestDTO;
import com.dishcraft.model.Recipe;
import com.dishcraft.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    @Autowired
    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

   @PostMapping
public ResponseEntity<?> createRecipe(@Valid @RequestBody RecipeRequestDTO recipeDTO,
                                      @RequestHeader(value = "userid", required = false) String userId) {
    // Check if userId is missing
    if (userId == null || userId.trim().isEmpty()) {
        return ResponseEntity
                .badRequest()
                .body("Missing required header: Userid");
    }

    Recipe recipe = Recipe.builder()
            .title(recipeDTO.getTitle())
            .description(recipeDTO.getDescription())
            .ingredients(recipeDTO.getIngredients())
            .instructions(recipeDTO.getInstructions())
            .imageUrl(recipeDTO.getImageUrl())
            .tags(recipeDTO.getTags())
            .userId(userId)
            .build();

    return ResponseEntity.ok(recipeService.createRecipe(recipe));
}


    @GetMapping
    public List<Recipe> getAllRecipes() {
        return recipeService.getAllRecipes();
    }

    @GetMapping("/{id}")
    public Recipe getRecipeById(@PathVariable String id) {
        return recipeService.getRecipeById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Recipe> getRecipesByUser(@PathVariable String userId) {
        return recipeService.getRecipesByUser(userId);
    }

    @PutMapping("/{id}")
public ResponseEntity<?> updateRecipe(@PathVariable String id,
                                     @Valid @RequestBody RecipeRequestDTO recipeDTO,
                                     @RequestHeader("userId") String userId) {
    Recipe existingRecipe = recipeService.getRecipeById(id);
    if (existingRecipe == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Recipe not found");
    }
    if (!existingRecipe.getUserId().equals(userId)) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized");
    }

    existingRecipe.setTitle(recipeDTO.getTitle());
    existingRecipe.setDescription(recipeDTO.getDescription());
    existingRecipe.setIngredients(recipeDTO.getIngredients());
    existingRecipe.setInstructions(recipeDTO.getInstructions());
    existingRecipe.setImageUrl(recipeDTO.getImageUrl());
    existingRecipe.setTags(recipeDTO.getTags());
    return ResponseEntity.ok(recipeService.updateRecipe(existingRecipe));
}


    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable String id, 
                           @RequestHeader("userId") String userId) {
        Recipe recipe = recipeService.getRecipeById(id);
        if(recipe != null && recipe.getUserId().equals(userId)) {
            recipeService.deleteRecipe(id);
        }
    }

    @GetMapping("/search")
    public List<Recipe> searchRecipes(@RequestParam String query) {
        return recipeService.searchRecipes(query);
    }
}