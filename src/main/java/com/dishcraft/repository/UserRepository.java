// src/main/java/com/dishcraft/repository/UserRepository.java
package com.dishcraft.repository;

import com.dishcraft.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
     List<User> findByUsernameContainingOrEmailContaining(String username, String email);
}