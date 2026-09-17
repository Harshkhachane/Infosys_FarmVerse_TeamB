package com.farmverse.controller;

import com.farmverse.model.Subscription;
import com.farmverse.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    // Get all subscriptions (for admin)
    @GetMapping
    public ResponseEntity<List<Subscription>> getAllSubscriptions() {
        List<Subscription> subs = subscriptionRepository.findAll();
        // Recompute status dynamically
        subs.forEach(s -> s.setStatus(s.computeStatus()));
        return ResponseEntity.ok(subs);
    }

    // Get subscriptions for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getByUser(@PathVariable String userId) {
        List<Subscription> subs = subscriptionRepository.findByUserId(userId);
        subs.forEach(s -> s.setStatus(s.computeStatus()));
        return ResponseEntity.ok(subs);
    }

    // Create a new subscription (30-day free trial auto-calculated)
    @PostMapping
    public ResponseEntity<Subscription> createSubscription(@RequestBody Subscription subscription) {
        LocalDate today = LocalDate.now();
        subscription.setStartDate(today.toString());
        // If it's FREE_TRIAL, expiry = start + 30 days
        if ("FREE_TRIAL".equals(subscription.getPlan()) || subscription.getPlan() == null) {
            subscription.setPlan("FREE_TRIAL");
            subscription.setExpiryDate(today.plusDays(30).toString());
        }
        subscription.setActive(true);
        subscription.setStatus(subscription.computeStatus());
        Subscription saved = subscriptionRepository.save(subscription);
        return ResponseEntity.ok(saved);
    }

    // Admin: update/upgrade a subscription plan
    @PutMapping("/{id}")
    public ResponseEntity<Subscription> updateSubscription(@PathVariable String id, @RequestBody Subscription updatedData) {
        return subscriptionRepository.findById(id).map(sub -> {
            if (updatedData.getPlan() != null) sub.setPlan(updatedData.getPlan());
            if (updatedData.getExpiryDate() != null) sub.setExpiryDate(updatedData.getExpiryDate());
            sub.setActive(updatedData.isActive());
            sub.setStatus(sub.computeStatus());
            return ResponseEntity.ok(subscriptionRepository.save(sub));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin: delete subscription
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSubscription(@PathVariable String id) {
        if (subscriptionRepository.existsById(id)) {
            subscriptionRepository.deleteById(id);
            return ResponseEntity.ok("Subscription deleted");
        }
        return ResponseEntity.notFound().build();
    }

    // Admin: toggle activate/deactivate
    @PutMapping("/{id}/toggle")
    public ResponseEntity<Subscription> toggleActive(@PathVariable String id) {
        return subscriptionRepository.findById(id).map(sub -> {
            sub.setActive(!sub.isActive());
            sub.setStatus(sub.computeStatus());
            return ResponseEntity.ok(subscriptionRepository.save(sub));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Summary stats for admin
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSubStats() {
        List<Subscription> all = subscriptionRepository.findAll();
        all.forEach(s -> s.setStatus(s.computeStatus()));
        long trial = all.stream().filter(s -> "TRIAL".equals(s.computeStatus())).count();
        long active = all.stream().filter(s -> "ACTIVE".equals(s.computeStatus())).count();
        long expired = all.stream().filter(s -> "EXPIRED".equals(s.computeStatus())).count();
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", all.size());
        stats.put("trial", trial);
        stats.put("active", active);
        stats.put("expired", expired);
        return ResponseEntity.ok(stats);
    }
}
