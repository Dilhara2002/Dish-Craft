package com.dishcraft.controller;

import com.dishcraft.model.Comment;
import com.dishcraft.model.Like;
import com.dishcraft.service.CommentService;
import com.dishcraft.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interaction")
public class CommentLikeController {

    private final CommentService commentService;
    private final LikeService likeService;

    @Autowired
    public CommentLikeController(CommentService commentService, LikeService likeService) {
        this.commentService = commentService;
        this.likeService = likeService;
    }

    // // Comments

    // @PostMapping("/comments/{recipeId}")
    // public Comment addComment(@PathVariable String recipeId,
    // @RequestHeader("userId") String userId,
    // @RequestParam String text) {
    // return commentService.addComment(recipeId, userId, text);
    // }

    @PostMapping("/comments/{recipeId}")
    public ResponseEntity<Comment> addComment(@PathVariable String recipeId,
            @RequestHeader("userId") String userId,
            @RequestParam String text) {
        Comment comment = commentService.addComment(recipeId, userId, text);
        if (comment != null) {
            return ResponseEntity.ok(comment);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/comments/{commentId}")
    public Comment updateComment(@PathVariable String commentId,
            @RequestHeader("userId") String userId,
            @RequestParam String text) {
        return commentService.updateComment(commentId, userId, text);
    }

    @DeleteMapping("/comments/{commentId}")
    public void deleteComment(@PathVariable String commentId,
            @RequestHeader("userId") String userId) {
        commentService.deleteComment(commentId, userId);
    }

    @GetMapping("/comments/recipe/{recipeId}")
    public List<Comment> getComments(@PathVariable String recipeId) {
        return commentService.getCommentsByRecipe(recipeId);
    }

    // Likes

    @PostMapping("/likes/{recipeId}")
    public String likeRecipe(@PathVariable String recipeId,
            @RequestHeader("userId") String userId) {
        return likeService.likeRecipe(recipeId, userId);
    }

    @DeleteMapping("/likes/{recipeId}")
    public String unlikeRecipe(@PathVariable String recipeId,
            @RequestHeader("userId") String userId) {
        return likeService.unlikeRecipe(recipeId, userId);
    }

    @GetMapping("/likes/recipe/{recipeId}")
    public List<Like> getLikes(@PathVariable String recipeId) {
        return likeService.getLikesByRecipe(recipeId);
    }
}
