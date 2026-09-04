package com.farmverse.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmverse.model.Farm;
import com.farmverse.model.User;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmRepository farmRepository;

    // Get all registered users (passwords cleared before sending)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    // Admin Dashboard statistics from real DB
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        List<User> users = userRepository.findAll();
        List<Farm> farms = farmRepository.findAll();

        long totalUsers = users.size();
        long totalFarmers = users.stream().filter(u -> !"ADMIN".equalsIgnoreCase(u.getRole())).count();
        long totalAdmins = users.stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole())).count();
        long totalFarms = farms.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalFarmers", totalFarmers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalFarms", totalFarms);

        return ResponseEntity.ok(stats);
    }

    // Delete a user by ID (Admin-only operation)
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}