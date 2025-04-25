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
    private String title;
    private String description;
    private List<String> ingredients;
    private String instructions;
    private String imageUrl;
    private String userId;
    private List<String> tags;
    
    @Builder.Default
    private int likes = 0;
}