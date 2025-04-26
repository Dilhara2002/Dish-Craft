package com.dishcraft.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe {
    @Id
    private String id;
    
    private String title;          // FIX: previously was "name"
    private String description;
    private List<String> ingredients;
    private List<String> instructions;  // FIX: previously was "steps"
    private String imageUrl;
    private List<String> tags;
    private String userId; // reference to user who created it
}
