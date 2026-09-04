package com.farmverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "farms")
public class Farm {
    @Id
    private String id;
    private String userId; // Kis user ka khet hai (User ID se link hoga)
    private String name;   // North Ridge Valley
    private String crop;   // Tomato /for Mapping
    private double area;   // Farm ka size | Hectares or Acres (e.g., 42.0) /count karne k liyeee
    private double moisture; // e.g., 18.4  Soil me kitni moisture (paani) hai
    private String yieldEstimation; // e.g., "8.2t/h" Kitni crop produce hone ki expected prediction hai
    private String pestRisk; // e.g., "Medium" Crop par pest (keede) attack ka risk

    
}