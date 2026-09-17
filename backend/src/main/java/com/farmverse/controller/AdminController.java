package com.farmverse.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.farmverse.model.Crop;
import com.farmverse.model.Farm;
import com.farmverse.model.User;
import com.farmverse.repository.CropRepository;
import com.farmverse.repository.FarmRepository;
import com.farmverse.repository.UserRepository;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private CropRepository cropRepository;

    @Autowired
    private MongoClient mongoClient;

    // Get all registered users (passwords cleared before sending)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    // Get all farms
    @GetMapping("/farms")
    public ResponseEntity<List<Farm>> getAllFarms() {
        return ResponseEntity.ok(farmRepository.findAll());
    }

    // Get all crops
    @GetMapping("/crops")
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAll());
    }

    // Admin Dashboard statistics from real DB
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        List<User> users = userRepository.findAll();
        List<Farm> farms = farmRepository.findAll();
        List<Crop> crops = cropRepository.findAll();

        long totalUsers = users.size();
        long totalFarmers = users.stream().filter(u -> !"ADMIN".equalsIgnoreCase(u.getRole())).count();

        // FIX: System 'admin' DB ki jagah 'Farmverse' database se 'admin' collection count karein
        MongoDatabase farmverseDb = mongoClient.getDatabase("Farmverse");
        long totalAdmins = farmverseDb.getCollection("admin").countDocuments();

        long totalFarms = farms.size();
        long totalCrops = crops.size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalFarmers", totalFarmers);
        stats.put("totalAdmins", totalAdmins);
        stats.put("totalFarms", totalFarms);
        stats.put("totalCrops", totalCrops);

        return ResponseEntity.ok(stats);
    }

    // Delete a user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    // Delete a farm by ID
    @DeleteMapping("/farms/{id}")
    public ResponseEntity<String> deleteFarm(@PathVariable String id) {
        if (farmRepository.existsById(id)) {
            farmRepository.deleteById(id);
            return ResponseEntity.ok("Farm deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    // Delete a crop by ID
    @DeleteMapping("/crops/{id}")
    public ResponseEntity<String> deleteCrop(@PathVariable String id) {
        if (cropRepository.existsById(id)) {
            cropRepository.deleteById(id);
            return ResponseEntity.ok("Crop deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }
}