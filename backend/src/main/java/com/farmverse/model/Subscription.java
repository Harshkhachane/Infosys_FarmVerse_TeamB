package com.farmverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Data
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;

    private String userId;          // Reference to users collection
    private String userName;
    private String userEmail;

    private String businessName;
    private String plan;            // FREE_TRIAL, BASIC, PREMIUM, ENTERPRISE

    private String startDate;       // ISO date string yyyy-MM-dd
    private String expiryDate;      // ISO date string yyyy-MM-dd

    private String status;          // TRIAL, ACTIVE, EXPIRED

    private boolean active;         // Admin can toggle

    // Compute status dynamically
    public String computeStatus() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate start = LocalDate.parse(this.startDate);
            LocalDate expiry = LocalDate.parse(this.expiryDate);

            if (!active) return "INACTIVE";
            if (today.isAfter(expiry)) return "EXPIRED";

            // Trial period = first 30 days
            long daysSinceStart = ChronoUnit.DAYS.between(start, today);
            if (daysSinceStart <= 30 && "FREE_TRIAL".equals(this.plan)) return "TRIAL";

            return "ACTIVE";
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }
}
