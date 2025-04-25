// src/main/java/com/dishcraft/dto/RecipeRequestDTO.java
package com.dishcraft.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.List;

@Data
public class RecipeRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Ingredients are required")
    private List<String> ingredients;
    
    @NotBlank(message = "Instructions are required")
    private String instructions;
    
    private String imageUrl;
    private List<String> tags;
}