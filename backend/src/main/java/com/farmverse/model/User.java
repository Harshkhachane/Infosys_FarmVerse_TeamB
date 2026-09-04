package com.farmverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

@Data
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private String role;

    // Naye added profile fields
    private String mobileNumber;
    private String village;
    private String district;
    private String stateRegion;
    private String streetAddress;

    

}