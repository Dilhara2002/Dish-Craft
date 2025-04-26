// src/main/java/com/dishcraft/repository/RecipeRepository.java
package com.dishcraft.repository;

import com.dishcraft.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    // List<Recipe> findByNameContainingIgnoreCase(String name);
    List<Recipe> findByTitleContainingIgnoreCase(String title);

    List<Recipe> findByUserId(String userId);
    // List<Recipe> findByTitleContainingIgnoreCase(String query);
}