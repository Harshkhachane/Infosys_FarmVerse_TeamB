package com.farmverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "crops")
public class Crop {

    @Id
    private String id;
    private String farmId;      // Link to Farm
    private String name;        // e.g., "Wheat", "Tomato"
    private String category;    // e.g., "Vegetable", "Grain"
    private String sowingDate;  // e.g., "2026-03-15"
    private String status;      // e.g., "PLANTED", "GROWING", "HARVESTED"

    public Crop() {}

    public Crop(String farmId, String name, String category, String sowingDate, String status) {
        this.farmId = farmId;
        this.name = name;
        this.category = category;
        this.sowingDate = sowingDate;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFarmId() { return farmId; }
    public void setFarmId(String farmId) { this.farmId = farmId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSowingDate() { return sowingDate; }
    public void setSowingDate(String sowingDate) { this.sowingDate = sowingDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}