package com.farmverse.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.farmverse.model.Farm;
import com.farmverse.repository.FarmRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private FarmRepository farmRepository; 

    @GetMapping("/summary/{userId}")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        
        // MongoDB se live data nikalne ka process
        List<Farm> userFarms = farmRepository.findByUserId(userId);
        
        int totalFarms = userFarms.size(); 
        double totalAcreage = userFarms.stream().mapToDouble(Farm::getArea).sum(); 
        
        response.put("totalFarms", totalFarms);
        response.put("totalAcreage", totalAcreage + " Acres");

        // Weather Data
        Map<String, Object> weather = new HashMap<>();
        weather.put("temp", "28°C");
        weather.put("condition", "Subtropical");
        weather.put("humidity", "64%");
        weather.put("windSpeed", "12 km/h");
        response.put("weather", weather);
        
        // Dynamic Alerts
        Map<String, String> seasonAlert = new HashMap<>();
        if (totalFarms == 0) {
            seasonAlert.put("title", "Welcome to AgriYield!");
            seasonAlert.put("message", "Start by adding your first farm to get real-time alerts.");
        } else {
            seasonAlert.put("title", "Monsoon Preparation Required");
            seasonAlert.put("message", "High rainfall expected. Clear drainage in your " + totalFarms + " fields.");
        }
        response.put("seasonAlert", seasonAlert);

        // Advisories
        List<Map<String, String>> advisories = new ArrayList<>();
        if (!userFarms.isEmpty()) {
            Farm firstFarm = userFarms.get(0);
            Map<String, String> adv1 = new HashMap<>();
            adv1.put("type", "Irrigation Optimization");
            adv1.put("time", "JUST NOW");
            adv1.put("desc", firstFarm.getName() + " moisture level is at " + firstFarm.getMoisture() + "%.");
            advisories.add(adv1);
        } else {
            Map<String, String> defaultAdv = new HashMap<>();
            defaultAdv.put("type", "General Advisory");
            defaultAdv.put("time", "NOW");
            defaultAdv.put("desc", "Please add a farm to receive localized alerts.");
            advisories.add(defaultAdv);
        }
        response.put("advisories", advisories);

        return ResponseEntity.ok(response);
    }
}