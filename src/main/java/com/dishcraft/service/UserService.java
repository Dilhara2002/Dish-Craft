package com.dishcraft.service;

import com.dishcraft.dto.UserResponseDTO;
import com.dishcraft.dto.UserUpdateDTO;
import com.dishcraft.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createUser(User user);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();

    User updateUserFields(String id, UserUpdateDTO userDTO);

    User updateUser(String id, User user);
    void deleteUser(String id);
    Optional<User> getUserById(String id);
    UserResponseDTO getUserInfoByEmail(String email);


     // Admin-specific methods
     List<User> findAllUsers();
     User promoteToAdmin(String id);
     User demoteFromAdmin(String id);
     List<User> searchUsers(String keyword);
}
