package com.dishcraft.service;

import com.dishcraft.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();

    User updateUser(String id, User user);
    void deleteUser(String id);
    Optional<User> getUserById(String id);
}
