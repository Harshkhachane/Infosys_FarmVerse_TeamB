package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.farmverse.model.Crop;
import com.farmverse.repository.CropRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    @Autowired
    private CropRepository cropRepository;

    // 1. Add Crop
    @PostMapping
    public ResponseEntity<Crop> addCrop(@RequestBody Crop crop) {
        Crop savedCrop = cropRepository.save(crop);
        return ResponseEntity.ok(savedCrop);
    }

    // 2. Get All Crops
    @GetMapping
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAll());
    }

    // 3. Get Crop by ID
    @GetMapping("/{id}")
    public ResponseEntity<Crop> getCropById(@PathVariable String id) {
        Optional<Crop> crop = cropRepository.findById(id);
        return crop.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 4. Get Crops by Farm ID
    @GetMapping("/farm/{farmId}")
    public ResponseEntity<List<Crop>> getCropsByFarmId(@PathVariable String farmId) {
        return ResponseEntity.ok(cropRepository.findByFarmId(farmId));
    }

    // 5. Update Crop
    @PutMapping("/{id}")
    public ResponseEntity<Crop> updateCrop(@PathVariable String id, @RequestBody Crop cropDetails) {
        Optional<Crop> optionalCrop = cropRepository.findById(id);
        if (optionalCrop.isPresent()) {
            Crop existingCrop = optionalCrop.get();
            existingCrop.setFarmId(cropDetails.getFarmId());
            existingCrop.setName(cropDetails.getName());
            existingCrop.setCategory(cropDetails.getCategory());
            existingCrop.setSowingDate(cropDetails.getSowingDate());
            existingCrop.setStatus(cropDetails.getStatus());

            return ResponseEntity.ok(cropRepository.save(existingCrop));
        }
        return ResponseEntity.notFound().build();
    }

    // 6. Delete Crop
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCrop(@PathVariable String id) {
        if (cropRepository.existsById(id)) {
            cropRepository.deleteById(id);
            return ResponseEntity.ok("Crop deleted successfully!");
        }
        return ResponseEntity.notFound().build();
    }
}