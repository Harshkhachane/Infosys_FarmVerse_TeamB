package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.farmverse.model.User;
import com.farmverse.service.UserService;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private UserService userService;

    // 1. GET USER PROFILE DATA (Farmer Profile Screen par details show karne ke liye)
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    // 2. UPDATE USER PROFILE DATA (Farmer Profile me "Edit Fields" save karne ke liye)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable String id, @RequestBody User updatedData) {
        User user = userService.updateUserProfile(id, updatedData);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.badRequest().body("User not found or update failed");
    }
}
