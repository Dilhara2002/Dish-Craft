package com.dishcraft.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class RecipeRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotEmpty(message = "Ingredients are required")
    private List<String> ingredients;
    
    @NotEmpty(message = "Instructions are required")
    private List<String> instructions;  // FIXED to List<String>
    
    private String imageUrl;
    private List<String> tags;
}
