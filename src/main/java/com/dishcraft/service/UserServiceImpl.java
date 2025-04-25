package com.dishcraft.service;

import com.dishcraft.model.User;
import com.dishcraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository; // ✅ This line was missing
    private final PasswordEncoder passwordEncoder;

    @Autowired
public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}

    @Override
    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
public User updateUser(String id, User updatedUser) {
    Optional<User> optionalUser = userRepository.findById(id);
    if (optionalUser.isPresent()) {
        User existingUser = optionalUser.get();
        existingUser.setUsername(updatedUser.getUsername());
        existingUser.setEmail(updatedUser.getEmail());
        // Password update karannam eṭath logic ekak danna puluwan
        return userRepository.save(existingUser);
    } else {
        throw new RuntimeException("User not found");
    }
}

@Override
public void deleteUser(String id) {
    if (userRepository.existsById(id)) {
        userRepository.deleteById(id);
    } else {
        throw new RuntimeException("User not found");
    }
}


}
