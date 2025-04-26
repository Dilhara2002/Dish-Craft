package com.dishcraft.repository;

import com.dishcraft.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByRecipeId(String recipeId);
    boolean existsByRecipeIdAndUserId(String recipeId, String userId);
}
