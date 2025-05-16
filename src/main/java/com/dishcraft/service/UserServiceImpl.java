package com.dishcraft.service;

import com.dishcraft.dto.UserResponseDTO;
import com.dishcraft.dto.UserUpdateDTO;
import com.dishcraft.model.User;
import com.dishcraft.model.Role;
import com.dishcraft.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User createUser(User user) {
        log.info("Creating new user with email: {}", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        log.info("Created user with ID: {}", savedUser.getId());
        return savedUser;
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        log.debug("Fetching user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        log.debug("Fetching all users");
        return userRepository.findAll();
    }

    @Override
    public Optional<User> getUserById(String id) {
        log.debug("Fetching user by ID: {}", id);
        return userRepository.findById(id);
    }

    @Override
    @Transactional
    public User updateUserFields(String id, UserUpdateDTO userDTO) {
        log.info("Updating user with ID: {}", id);
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new RuntimeException("User not found with ID: " + id);
                });

        if (userDTO.getUsername() != null && !userDTO.getUsername().equals(existingUser.getUsername())) {
            log.info("Updating username from {} to {}", existingUser.getUsername(), userDTO.getUsername());
            existingUser.setUsername(userDTO.getUsername());
        }

        if (userDTO.getFirstName() != null && !userDTO.getFirstName().equals(existingUser.getFirstName())) {
            log.info("Updating firstName from {} to {}", existingUser.getFirstName(), userDTO.getFirstName());
            existingUser.setFirstName(userDTO.getFirstName());
        }

        if (userDTO.getLastName() != null && !userDTO.getLastName().equals(existingUser.getLastName())) {
            log.info("Updating lastName from {} to {}", existingUser.getLastName(), userDTO.getLastName());
            existingUser.setLastName(userDTO.getLastName());
        }

        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(existingUser.getEmail())) {
            log.info("Updating email from {} to {}", existingUser.getEmail(), userDTO.getEmail());
            existingUser.setEmail(userDTO.getEmail());
        }

        if (userDTO.getPassword() != null) {
            log.info("Updating password");
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        if (userDTO.getProfileImage() != null && !userDTO.getProfileImage().equals(existingUser.getProfileImage())) {
            log.info("Updating profileImage from {} to {}", existingUser.getProfileImage(), userDTO.getProfileImage());
            existingUser.setProfileImage(userDTO.getProfileImage());
        }

        User updatedUser = userRepository.save(existingUser);
        log.info("Successfully updated user with ID: {}", id);
        return updatedUser;
    }

    @Override
    @Transactional
    public void deleteUser(String id) {
        log.info("Deleting user with ID: {}", id);
        if (!userRepository.existsById(id)) {
            log.error("User not found with ID: {}", id);
            throw new RuntimeException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
        log.info("Successfully deleted user with ID: {}", id);
    }

    @Override
    public UserResponseDTO getUserInfoByEmail(String email) {
        log.debug("Fetching user info by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new RuntimeException("User not found with email: " + email);
                });

        return UserResponseDTO.builder()
                .username(user.getUsername())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profileImage(user.getProfileImage())
                .roles(user.getRoles())
                .build();
    }

    @Override
    public List<User> findAllUsers() {
        log.debug("Fetching all users (admin)");
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User promoteToAdmin(String id) {
        log.info("Promoting user to admin with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new RuntimeException("User not found with ID: " + id);
                });
        
        if (!user.hasRole(Role.ADMIN)) {
            user.addRole(Role.ADMIN);
            User updatedUser = userRepository.save(user);
            log.info("Successfully promoted user to admin with ID: {}", id);
            return updatedUser;
        }
        log.warn("User already has admin role with ID: {}", id);
        return user;
    }

    @Override
    @Transactional
    public User demoteFromAdmin(String id) {
        log.info("Demoting user from admin with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", id);
                    return new RuntimeException("User not found with ID: " + id);
                });
        
        if (user.hasRole(Role.ADMIN)) {
            user.removeRole(Role.ADMIN);
            User updatedUser = userRepository.save(user);
            log.info("Successfully demoted user from admin with ID: {}", id);
            return updatedUser;
        }
        log.warn("User doesn't have admin role with ID: {}", id);
        return user;
    }

    @Override
    public List<User> searchUsers(String keyword) {
        log.debug("Searching users with keyword: {}", keyword);
        return userRepository.findByUsernameContainingOrEmailContaining(keyword, keyword);
    }
}