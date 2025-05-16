package com.dishcraft.dto;

import java.io.Serializable;

/**
 * Data Transfer Object for Comments.
 */
public class CommentDTO implements Serializable {
    private String id;
    private String text;
    private String username;
    private String userId;

    public CommentDTO() {
        // Default constructor for serialization/deserialization
    }

    public CommentDTO(String id, String text, String username, String userId) {
        this.id = id;
        this.text = text;
        this.username = username;
        this.userId = userId;
    }

    // Getters
    public String getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getUsername() {
        return username;
    }

    public String getUserId() {
        return userId;
    }

    // Setters
    public void setId(String id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
