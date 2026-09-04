package com.farmverse.serviceImpl;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.farmverse.dto.ApiResponse;
import com.farmverse.dto.LoginRequest;
import com.farmverse.dto.SignupRequest;
import com.farmverse.model.User;
import com.farmverse.repository.UserRepository;
import com.farmverse.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    private User buildPublicUser(User user) {
        User publicUser = new User();
        publicUser.setId(user.getId());
        publicUser.setName(user.getName());
        publicUser.setEmail(user.getEmail());
        publicUser.setPhone(user.getPhone());
        publicUser.setMobileNumber(user.getMobileNumber());
        publicUser.setVillage(user.getVillage());
        publicUser.setDistrict(user.getDistrict());
        publicUser.setStateRegion(user.getStateRegion());
        publicUser.setStreetAddress(user.getStreetAddress());
        publicUser.setRole(user.getRole());
        return publicUser;
    }

    @Override
    public ApiResponse registerUser(SignupRequest signupRequest) {
        // Validation check for empty email
        if (signupRequest.getEmail() == null || signupRequest.getEmail().trim().isEmpty()) {
            return new ApiResponse(false, "Email is required!");
        }

        String formattedEmail = signupRequest.getEmail().trim().toLowerCase();
        
        // Check if email already exists in Database
        Optional<User> existingUser = userRepository.findByEmail(formattedEmail);
        if (existingUser.isPresent()) {
            return new ApiResponse(false, "Email is already registered!");
        }

        User user = new User();
        
        // 1. Name Set Karein
        user.setName(signupRequest.getName()); 
        
        // 2. Email & Password Set Karein
        user.setEmail(formattedEmail);
        user.setPassword(signupRequest.getPassword());
        
        // 3. Phone & MobileNumber Dono Fields Me Same Value Sync Karein
        String phoneNumber = signupRequest.getPhone();
        user.setPhone(phoneNumber);
        user.setMobileNumber(phoneNumber);
        
        // 4. Role Set Karein (Default: USER)
        user.setRole(signupRequest.getRole() != null && !signupRequest.getRole().trim().isEmpty() 
                     ? signupRequest.getRole() : "USER"); 

        // MongoDB Database Me Save Karein
        userRepository.save(user);
        return new ApiResponse(true, "User registered successfully!", buildPublicUser(user));
    }

    @Override
    public ApiResponse loginUser(LoginRequest loginRequest) {
        if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
            return new ApiResponse(false, "Email and Password are required!");
        }

        String formattedEmail = loginRequest.getEmail().trim().toLowerCase();
        Optional<User> userOptional = userRepository.findByEmail(formattedEmail);
        
        if (userOptional.isEmpty()) {
            return new ApiResponse(false, "Invalid Email or Password!");
        }

        User user = userOptional.get();

        // Password Validation Check
        if (!user.getPassword().equals(loginRequest.getPassword())) {
            return new ApiResponse(false, "Invalid Email or Password!");
        }

        return new ApiResponse(true, "Login successful! Welcome " + user.getName(), buildPublicUser(user));
    }

    // ==========================================
    //  PROFILE METHODS
    // ==========================================

    @Override
    public User getUserById(String id) {
        // MongoDB ki String ID ke base par user return karega
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User updateUserProfile(String id, User updatedData) {
        return userRepository.findById(id).map(user -> {
            // Frontend se aane wala data update karein
            if (updatedData.getName() != null) user.setName(updatedData.getName());
            
            if (updatedData.getPhone() != null) {
                user.setPhone(updatedData.getPhone());
                user.setMobileNumber(updatedData.getPhone());
            } else if (updatedData.getMobileNumber() != null) {
                user.setPhone(updatedData.getMobileNumber());
                user.setMobileNumber(updatedData.getMobileNumber());
            }

            if (updatedData.getVillage() != null) user.setVillage(updatedData.getVillage());
            if (updatedData.getDistrict() != null) user.setDistrict(updatedData.getDistrict());
            if (updatedData.getStateRegion() != null) user.setStateRegion(updatedData.getStateRegion());
            if (updatedData.getStreetAddress() != null) user.setStreetAddress(updatedData.getStreetAddress());
            
            return userRepository.save(user); // Updated user DB me save ho jayega
        }).orElse(null);
    }
}