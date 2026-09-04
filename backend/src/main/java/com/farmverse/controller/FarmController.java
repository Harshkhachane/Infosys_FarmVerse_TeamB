package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.farmverse.model.Farm;
import com.farmverse.repository.FarmRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/farms")
@CrossOrigin(origins = "*") // Frontend connectivity ke liye zaroori hai!
public class FarmController {

    @Autowired
    private FarmRepository farmRepository;

    // 1. CREATE: Add a new Farm / Crop
    @PostMapping
    public ResponseEntity<Farm> createFarm(@RequestBody Farm farm) {
        Farm savedFarm = farmRepository.save(farm);
        return ResponseEntity.ok(savedFarm);
    }

    // 2. READ: Get all farms for a specific User (Frontend Dashboard view)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Farm>> getFarmsByUserId(@PathVariable String userId) {
        List<Farm> farms = farmRepository.findByUserId(userId);
        return ResponseEntity.ok(farms);
    }

    //  Get all Farms 
    @GetMapping
    public ResponseEntity<List<Farm>> getAllFarms() {
        List<Farm> farms = farmRepository.findAll();
        return ResponseEntity.ok(farms);
}
    // 3. READ SINGLE: Get farm details by Farm ID
    @GetMapping("/{id}")
    public ResponseEntity<Farm> getFarmById(@PathVariable String id) {
        Optional<Farm> farm = farmRepository.findById(id);
        return farm.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. UPDATE: Edit Farm or Crop Details
    @PutMapping("/{id}")
    public ResponseEntity<Farm> updateFarm(@PathVariable String id, @RequestBody Farm farmDetails) {
        Optional<Farm> optionalFarm = farmRepository.findById(id);
        
        if (optionalFarm.isPresent()) {
            Farm existingFarm = optionalFarm.get();

            existingFarm.setUserId(farmDetails.getUserId());
            existingFarm.setName(farmDetails.getName());

            existingFarm.setCrop(farmDetails.getCrop());
            existingFarm.setArea(farmDetails.getArea());
            existingFarm.setMoisture(farmDetails.getMoisture());
            existingFarm.setYieldEstimation(farmDetails.getYieldEstimation());
            existingFarm.setPestRisk(farmDetails.getPestRisk());
            
            Farm updatedFarm = farmRepository.save(existingFarm);
            return ResponseEntity.ok(updatedFarm);
        }
        return ResponseEntity.notFound().build();
    }

    // 5. DELETE: Remove a Farm / Crop
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFarm(@PathVariable String id) {
        if (farmRepository.existsById(id)) {
            farmRepository.deleteById(id);
            return ResponseEntity.ok("Farm deleted successfully!");
        }
        return ResponseEntity.notFound().build();
    }
}