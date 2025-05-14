package com.dishcraft.controller;

import com.dishcraft.model.User;
import com.dishcraft.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import com.dishcraft.dto.UserRequestDTO;
import com.dishcraft.dto.UserResponseDTO;

import jakarta.validation.Valid;

import com.dishcraft.dto.UserUpdateDTO;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user
    @PostMapping
    public User createUser(@Valid @RequestBody UserRequestDTO userDTO) {
        User user = User.builder()
                .username(userDTO.getUsername())
                .email(userDTO.getEmail())
                .password(userDTO.getPassword()) // will encode in service
                .build();
    
        return userService.createUser(user);
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by email
    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

     // Get user by ID
     @GetMapping("/{id}")
     public ResponseEntity<User> getUserById(@PathVariable String id) {
         return userService.getUserById(id)
                 .map(ResponseEntity::ok)
                 .orElse(ResponseEntity.notFound().build());
     }
 
     // Update user
     @PutMapping("/{id}")
     public ResponseEntity<User> updateUser(
             @PathVariable String id,
             @Valid @RequestBody UserUpdateDTO userUpdateDTO) {
         
         User user = User.builder()
                 .username(userUpdateDTO.getUsername())
                 .email(userUpdateDTO.getEmail())
                 .password(userUpdateDTO.getPassword())
                 .profileImage(userUpdateDTO.getProfileImage())
                 .build();
                 
         return ResponseEntity.ok(userService.updateUser(id, user));
     }
 
     // Delete user
     @DeleteMapping("/{id}")
     public ResponseEntity<Void> deleteUser(@PathVariable String id) {
         userService.deleteUser(id);
         return ResponseEntity.noContent().build();
     }

        // Get user info by email
         @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponseDTO user = userService.getUserInfoByEmail(userDetails.getUsername()); // getEmail = username
        return ResponseEntity.ok(user);
    }
}
