package com.dishcraft.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Like {
    @Id
    private String id;
    private String recipeId;   // Which recipe is liked
    private String userId;     // Who liked
}
