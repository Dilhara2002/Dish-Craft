package com.dishcraft.service;

import com.dishcraft.model.Like;
import com.dishcraft.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    @Autowired
    public LikeServiceImpl(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    @Override
    public String likeRecipe(String recipeId, String userId) {
        if (!likeRepository.existsByRecipeIdAndUserId(recipeId, userId)) {
            Like like = Like.builder()
                    .recipeId(recipeId)
                    .userId(userId)
                    .build();
            likeRepository.save(like);
            return "Liked successfully!";
        } else {
            return "Already liked!";
        }
    }

    @Override
    public String unlikeRecipe(String recipeId, String userId) {
        List<Like> likes = likeRepository.findByRecipeId(recipeId);
        for (Like like : likes) {
            if (like.getUserId().equals(userId)) {
                likeRepository.delete(like);
                return "Unliked successfully!";
            }
        }
        return "Like not found!";
    }

    @Override
    public List<Like> getLikesByRecipe(String recipeId) {
        return likeRepository.findByRecipeId(recipeId);
    }
}
