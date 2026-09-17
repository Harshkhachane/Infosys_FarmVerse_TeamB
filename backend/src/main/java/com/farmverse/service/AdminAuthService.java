package com.farmverse.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.farmverse.dto.ApiResponse;
import com.farmverse.dto.SignupRequest;
import com.farmverse.dto.LoginRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminAuthService {

    @Autowired
    private MongoClient mongoClient;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ApiResponse registerAdmin(SignupRequest signupRequest) {
        if (signupRequest.getEmail() == null || signupRequest.getEmail().trim().isEmpty()) {
            return new ApiResponse(false, "Email is required!");
        }

        // FIX 1: Change "admin" to "Farmverse" and "admins" to "admin"
        MongoDatabase database = mongoClient.getDatabase("Farmverse");
        MongoCollection<Document> collection = database.getCollection("admin");

        String email = signupRequest.getEmail().trim().toLowerCase();
        
        Document existing = collection.find(new Document("email", email)).first();
        if (existing != null) {
            return new ApiResponse(false, "Admin email is already registered!");
        }

        String hashedPassword = passwordEncoder.encode(signupRequest.getPassword());

        Document adminDoc = new Document()
                .append("name", signupRequest.getName())
                .append("email", email)
                .append("password", hashedPassword)
                .append("role", "ADMIN");

        collection.insertOne(adminDoc);

        Map<String, Object> publicAdmin = buildPublicAdmin(adminDoc);
        return new ApiResponse(true, "Admin registered successfully!", publicAdmin);
    }

    private Map<String, Object> buildPublicAdmin(Document adminDoc) {
        Map<String, Object> publicAdmin = new HashMap<>();
        Object id = adminDoc.getObjectId("_id");
        publicAdmin.put("id", id != null ? id.toString() : null);
        publicAdmin.put("_id", id != null ? id.toString() : null);
        publicAdmin.put("name", adminDoc.getString("name"));
        publicAdmin.put("fullName", adminDoc.getString("name"));
        publicAdmin.put("email", adminDoc.getString("email"));
        publicAdmin.put("role", "ADMIN");
        return publicAdmin;
    }

    public ApiResponse loginAdmin(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return new ApiResponse(false, "Email and Password are required!");
        }

        // FIX 2: Change "admin" to "Farmverse" and "admins" to "admin"
        MongoDatabase database = mongoClient.getDatabase("Farmverse");
        MongoCollection<Document> collection = database.getCollection("admin");

        String email = loginRequest.getEmail().trim().toLowerCase();
        Document adminDoc = collection.find(new Document("email", email)).first();

        if (adminDoc == null) {
            return new ApiResponse(false, "Invalid Admin Email or Password!");
        }

        String storedPassword = adminDoc.getString("password");
        if (!passwordEncoder.matches(loginRequest.getPassword(), storedPassword)) {
            return new ApiResponse(false, "Invalid Admin Email or Password!");
        }

        Map<String, Object> publicAdmin = buildPublicAdmin(adminDoc);
        return new ApiResponse(true, "Admin Login successful! Welcome " + adminDoc.getString("name"), publicAdmin);
    }
}