package com.dishcraft.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    private String id;
    private String recipeId;   // Which recipe this comment belongs to
    private String userId;     // Who commented
    private String text;       // Comment text
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

