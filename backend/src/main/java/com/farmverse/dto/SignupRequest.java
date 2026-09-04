package com.farmverse.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SignupRequest {

    private String name;
    
    @JsonProperty("firstName")
    private String firstName;
    
    @JsonProperty("lastName")
    private String lastName;
    
    private String email;
    private String password;
    
    private String phone;
    
    @JsonProperty("mobile")
    private String mobile;
    
    private String role;

    // --- Getters and Setters ---

    public String getName() {
        if ((name == null || name.trim().isEmpty()) && (firstName != null || lastName != null)) {
            return ((firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "")).trim();
        }
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() {
        if ((phone == null || phone.trim().isEmpty()) && mobile != null) {
            return mobile;
        }
        return phone;
    }

    public void setPhone(String phone) { this.phone = phone; }

    public String getMobile() { return mobile; }
    public void setMobile(String mobile) { this.mobile = mobile; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}