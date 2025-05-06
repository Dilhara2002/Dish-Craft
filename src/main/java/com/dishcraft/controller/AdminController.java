package com.dishcraft.controller;

import com.dishcraft.model.User;
import com.dishcraft.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }

    @PostMapping("/{id}/promote")
    public ResponseEntity<User> promoteToAdmin(@PathVariable String id) {
        return ResponseEntity.ok(userService.promoteToAdmin(id));
    }

    @PostMapping("/{id}/demote")
    public ResponseEntity<User> demoteFromAdmin(@PathVariable String id) {
        return ResponseEntity.ok(userService.demoteFromAdmin(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}