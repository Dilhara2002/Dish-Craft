package com.dishcraft.repository;

import com.dishcraft.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByRecipeId(String recipeId);
}
