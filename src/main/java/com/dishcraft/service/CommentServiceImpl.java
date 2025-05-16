package com.dishcraft.service;

import com.dishcraft.model.Comment;
import com.dishcraft.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment addComment(String recipeId, String userId, String text) {
        Comment comment = Comment.builder()
                .recipeId(recipeId)
                .userId(userId)
                .text(text)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        return commentRepository.save(comment);
    }

    @Override
    public Comment updateComment(String commentId, String userId, String text) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getUserId().equals(userId)) {
                comment.setText(text);
                comment.setUpdatedAt(LocalDateTime.now());
                return commentRepository.save(comment);
            }
        }
        return null;
    }

    @Override
    public void deleteComment(String commentId, String userId) {
        Optional<Comment> optionalComment = commentRepository.findById(commentId);
        if (optionalComment.isPresent()) {
            Comment comment = optionalComment.get();
            if (comment.getUserId().equals(userId)) {
                commentRepository.deleteById(commentId);
            }
        }
    }

    @Override
    public List<Comment> getCommentsByRecipe(String recipeId) {
        return commentRepository.findByRecipeId(recipeId);
    }
}
