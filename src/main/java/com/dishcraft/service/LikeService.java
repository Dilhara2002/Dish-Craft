package com.dishcraft.service;

import com.dishcraft.model.Like;
import java.util.List;

public interface LikeService {
    String likeRecipe(String recipeId, String userId);
    String unlikeRecipe(String recipeId, String userId);
    List<Like> getLikesByRecipe(String recipeId);
}
