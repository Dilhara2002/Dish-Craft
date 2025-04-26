package com.dishcraft.service;

import com.dishcraft.model.Comment;
import java.util.List;

public interface CommentService {
    Comment addComment(String recipeId, String userId, String text);
    Comment updateComment(String commentId, String userId, String text);
    void deleteComment(String commentId, String userId);
    List<Comment> getCommentsByRecipe(String recipeId);
}
