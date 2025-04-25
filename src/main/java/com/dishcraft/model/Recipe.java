package com.dishcraft.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import javax.persistence.ManyToOne;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;

@Document(collection = "recipes")
public class Recipe {

    @Id
    private String id;
    private String title;
    private String description;
    private String ingredients;
    private String instructions;
    private String imageUrl;
    private String createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;  // Reference to User model

    // Getters and setters
    // Constructor, toString() methods
}
